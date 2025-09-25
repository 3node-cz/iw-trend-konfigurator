import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

export async function loader({ request }: LoaderFunctionArgs) {
  console.log('🔍 Material search endpoint hit');

  try {
    // Authenticate with app proxy
    const { session, admin } = await authenticate.public.appProxy(request);

    if (!session?.shop) {
      return json({ error: "No shop session found" }, { status: 401 });
    }

    if (!admin) {
      return json({ error: "Admin API not available" }, { status: 401 });
    }

    // Parse query parameters
    const url = new URL(request.url);
    const query = url.searchParams.get("query") || "";
    const limit = parseInt(url.searchParams.get("limit") || "250");
    const collection = url.searchParams.get("collection");
    const warehouse = url.searchParams.get("warehouse");

    console.log('🔍 Search params:', { query, limit, collection, warehouse });

    // Build GraphQL query
    let searchQuery = '';

    if (query && query.trim()) {
      // Check if this is a Shopify GID search (for loading saved configurations)
      if (query.startsWith('id:gid://shopify/')) {
        const shopifyId = query.replace('id:', '');
        console.log('🔍 Shopify GID search detected:', shopifyId);
        searchQuery = `id:${shopifyId}`;
      } else {
        // Check if it's a numeric ID (like from old variant IDs)
        if (/^\d+$/.test(query)) {
          // For numeric queries, search across multiple fields including variant IDs and SKUs
          searchQuery = `title:*${query}* OR vendor:*${query}* OR product_type:*${query}* OR tag:*${query}* OR sku:*${query}* OR variant_id:${query} OR barcode:${query}`;
          console.log('🔍 Numeric ID detected, using enhanced search for:', query);
        } else {
          // Regular text search - include SKU field for product codes
          searchQuery = `title:*${query}* OR vendor:*${query}* OR product_type:*${query}* OR tag:*${query}* OR sku:*${query}*`;
        }
      }
    } else {
      // If no query, return all products
      searchQuery = '*';
    }

    if (collection) {
      searchQuery += ` AND collection:${collection}`;
    }

    console.log('🔍 Final search query:', searchQuery);

    // Choose GraphQL query based on search type
    let graphqlQuery = '';
    let variables = {};

    if (query.startsWith('id:gid://shopify/')) {
      // Direct node query for exact ID lookup
      const shopifyId = query.replace('id:', '');
      console.log('🔍 Using direct node query for ID:', shopifyId);

      graphqlQuery = `
        query getProductOrVariant($id: ID!) {
          node(id: $id) {
            id
            ... on Product {
              title
              handle
              vendor
              productType
              tags
              featuredImage {
                url
                altText
              }
              images(first: 5) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    sku
                    price
                    inventoryQuantity
                    availableForSale
                    image {
                      url
                      altText
                    }
                    metafields(first: 10) {
                      edges {
                        node {
                          namespace
                          key
                          value
                        }
                      }
                    }
                  }
                }
              }
            }
            ... on ProductVariant {
              id
              title
              sku
              price
              inventoryQuantity
              availableForSale
              image {
                url
                altText
              }
              product {
                id
                title
                handle
                vendor
                productType
                tags
                featuredImage {
                  url
                  altText
                }
                images(first: 5) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
              }
              metafields(first: 10) {
                edges {
                  node {
                    namespace
                    key
                    value
                  }
                }
              }
            }
          }
        }
      `;
      variables = { id: shopifyId };
    } else {
      // Regular search query
      graphqlQuery = `
        query searchProducts($query: String!, $first: Int!) {
          products(first: $first, query: $query) {
            edges {
              node {
                id
                title
                handle
                vendor
                productType
                tags
                featuredImage {
                  url
                  altText
                }
                images(first: 5) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      sku
                      price
                      inventoryQuantity
                      availableForSale
                      image {
                        url
                        altText
                      }
                      metafields(first: 10) {
                        edges {
                          node {
                            namespace
                            key
                            value
                          }
                        }
                      }
                    }
                  }
                }
                metafields(first: 10) {
                  edges {
                    node {
                      namespace
                      key
                      value
                    }
                  }
                }
              }
            }
          }
        }
      `;
      variables = {
        query: searchQuery,
        first: Math.min(limit, 250) // Shopify limit
      };
    }

    console.log('🚀 Executing GraphQL query:', variables);

    const response = await admin.graphql(graphqlQuery, { variables });
    const result = await response.json();

    if (result.errors) {
      console.error('❌ GraphQL errors:', result.errors);
      return json({ error: "GraphQL query failed", details: result.errors }, { status: 400 });
    }

    // Transform the results to match our expected format
    const transformToMaterial = (product: any, variant: any) => {
      // Extract metafields into a more usable format
      const productMetafields = product.metafields.edges.reduce((acc: any, metafield: any) => {
        const { namespace, key, value } = metafield.node;
        acc[`${namespace}.${key}`] = value;
        return acc;
      }, {});

      const variantMetafields = variant?.metafields.edges.reduce((acc: any, metafield: any) => {
        const { namespace, key, value } = metafield.node;
        acc[`${namespace}.${key}`] = value;
        return acc;
      }, {}) || {};

      // Get images - prefer variant image, fallback to product featured image
      const variantImage = variant?.image?.url;
      const productImage = product.featuredImage?.url;
      const productImages = product.images?.edges?.map((edge: any) => edge.node.url) || [];

      return {
        id: variant?.id || product.id,
        title: product.title,
        handle: product.handle,
        vendor: product.vendor,
        productType: product.productType,
        tags: product.tags,
        image: variantImage || productImage,
        images: productImages,
        variant: variant ? {
          id: variant.id,
          title: variant.title,
          sku: variant.sku,
          price: variant.price || "0",
          inventoryQuantity: variant.inventoryQuantity,
          availableForSale: variant.availableForSale,
          metafields: variantMetafields
        } : undefined,
        metafields: productMetafields
      };
    };

    let materials = [];

    if (query.startsWith('id:gid://shopify/')) {
      // Handle direct node query result
      const node = result.data.node;
      if (node) {
        if (node.__typename === 'Product') {
          // It's a product
          const variant = node.variants.edges[0]?.node;
          materials.push(transformToMaterial(node, variant));
        } else if (node.__typename === 'ProductVariant') {
          // It's a variant - use the variant and its product
          materials.push(transformToMaterial(node.product, node));
        }
      }
    } else {
      // Handle regular search results
      materials = result.data.products.edges.map((edge: any) => {
        const product = edge.node;
        const variant = product.variants.edges[0]?.node;
        return transformToMaterial(product, variant);
      });
    }

    console.log(`✅ Found ${materials.length} materials`);

    return json(materials);

  } catch (error) {
    console.error('💥 Error searching materials:', error);

    return json({
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 });
  }
}