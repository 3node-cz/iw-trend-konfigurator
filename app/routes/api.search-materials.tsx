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

    if (query.startsWith('id:gid://shopify/') && !collection) {
      // Direct node query for exact ID lookup (but only if no collection filter is needed)
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
                    materialHeight: metafield(namespace: "material", key: "height") {
                      value
                    }
                    materialWidth: metafield(namespace: "material", key: "width") {
                      value
                    }
                    materialThickness: metafield(namespace: "material", key: "thickness") {
                      value
                    }
                    alternativeProducts: metafield(namespace: "custom", key: "alternative_products") {
                      value
                    }
                    allMetafields: metafields(first: 10) {
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
              alternativeProducts: metafield(namespace: "custom", key: "alternative_products") {
                value
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
                alternativeProducts: metafield(namespace: "custom", key: "alternative_products") {
                  value
                }
              }
              materialHeight: metafield(namespace: "material", key: "height") {
                value
              }
              materialWidth: metafield(namespace: "material", key: "width") {
                value
              }
              materialThickness: metafield(namespace: "material", key: "thickness") {
                value
              }
              alternativeProducts: metafield(namespace: "custom", key: "alternative_products") {
                value
              }
              allMetafields: metafields(first: 10) {
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
                      localWarehouseStock: metafield(namespace: "custom", key: "local_warehouse_stock") {
                        value
                      }
                      centralWarehouseStock: metafield(namespace: "custom", key: "central_warehouse_stock") {
                        value
                      }
                      materialHeight: metafield(namespace: "material", key: "height") {
                        value
                      }
                      materialWidth: metafield(namespace: "material", key: "width") {
                        value
                      }
                      materialThickness: metafield(namespace: "material", key: "thickness") {
                        value
                      }
                      alternativeProducts: metafield(namespace: "custom", key: "alternative_products") {
                        value
                      }
                      allMetafields: metafields(first: 10) {
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
                localWarehouseStock: metafield(namespace: "custom", key: "local_warehouse_stock") {
                  value
                }
                centralWarehouseStock: metafield(namespace: "custom", key: "central_warehouse_stock") {
                  value
                }
                alternativeProducts: metafield(namespace: "custom", key: "alternative_products") {
                  value
                }
                materialHeight: metafield(namespace: "material", key: "height") {
                  value
                }
                materialWidth: metafield(namespace: "material", key: "width") {
                  value
                }
                materialThickness: metafield(namespace: "material", key: "thickness") {
                  value
                }
                allMetafields: metafields(first: 10) {
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

    console.log('📦 Raw GraphQL response (first product):', JSON.stringify(result?.data?.products?.edges?.[0] || result?.data?.node, null, 2));

    if (result.errors) {
      console.error('❌ GraphQL errors:', result.errors);
      return json({ error: "GraphQL query failed", details: result.errors }, { status: 400 });
    }

    // Transform the results to match our expected format
    const transformToMaterial = (product: any, variant: any) => {
      // Extract metafields from allMetafields (generic metafields list)
      const productMetafields = product.allMetafields?.edges?.reduce((acc: any, metafield: any) => {
        const { namespace, key, value } = metafield.node;
        acc[`${namespace}.${key}`] = value;
        return acc;
      }, {}) || {};

      const variantMetafields = variant?.allMetafields?.edges?.reduce((acc: any, metafield: any) => {
        const { namespace, key, value } = metafield.node;
        acc[`${namespace}.${key}`] = value;
        return acc;
      }, {}) || {};

      // Add specific metafields that we explicitly queried
      if (product.alternativeProducts?.value) {
        productMetafields['custom.alternative_products'] = product.alternativeProducts.value;
      }
      if (product.materialHeight?.value) {
        productMetafields['material.height'] = product.materialHeight.value;
      }
      if (product.materialWidth?.value) {
        productMetafields['material.width'] = product.materialWidth.value;
      }
      if (product.materialThickness?.value) {
        productMetafields['material.thickness'] = product.materialThickness.value;
      }

      // Add variant-specific metafields
      if (variant) {
        if (variant.alternativeProducts?.value) {
          variantMetafields['custom.alternative_products'] = variant.alternativeProducts.value;
        }
        if (variant.materialHeight?.value) {
          variantMetafields['material.height'] = variant.materialHeight.value;
        }
        if (variant.materialWidth?.value) {
          variantMetafields['material.width'] = variant.materialWidth.value;
        }
        if (variant.materialThickness?.value) {
          variantMetafields['material.thickness'] = variant.materialThickness.value;
        }
      }

      // Merge metafields: variant metafields override product metafields
      const mergedMetafields = {
        ...productMetafields,
        ...variantMetafields
      };

      // Debug: Log all available metafields
      console.log('📦 Product metafields for', product.title, ':', Object.keys(productMetafields));
      if (variant) {
        console.log('📦 Variant metafields for', variant.title, ':', Object.keys(variantMetafields));
        console.log('📦 Variant inventory:', variant.inventoryQuantity);
      }
      console.log('📦 Merged metafields:', Object.keys(mergedMetafields));
      console.log('📦 Alternative products:', mergedMetafields['custom.alternative_products']);

      // Get images - prefer variant image, fallback to product featured image
      const variantImage = variant?.image?.url;
      const productImage = product.featuredImage?.url;
      const productImages = product.images?.edges?.map((edge: any) => edge.node.url) || [];

      // Extract dimensions from metafields (use merged metafields)
      let dimensions = undefined;
      const heightMeta = mergedMetafields['material.height'];
      const widthMeta = mergedMetafields['material.width'];
      const thicknessMeta = mergedMetafields['material.thickness'];

      if (heightMeta && widthMeta && thicknessMeta) {
        try {
          dimensions = {
            height: parseFloat(heightMeta),
            width: parseFloat(widthMeta),
            thickness: parseFloat(thicknessMeta)
          };
        } catch (e) {
          console.warn('Failed to parse dimensions:', e);
        }
      }

      return {
        id: variant?.id || product.id,
        title: product.title,
        handle: product.handle,
        vendor: product.vendor,
        productType: product.productType,
        tags: product.tags,
        image: variantImage || productImage,
        images: productImages,
        dimensions,
        variant: variant ? {
          id: variant.id,
          title: variant.title,
          sku: variant.sku,
          price: variant.price || "0",
          inventoryQuantity: variant.inventoryQuantity,
          availableForSale: variant.availableForSale,
          metafields: variantMetafields
        } : undefined,
        metafields: mergedMetafields
      };
    };

    let materials = [];

    if (query.startsWith('id:gid://shopify/') && !collection) {
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