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
      searchQuery = `title:*${query}* OR vendor:*${query}* OR product_type:*${query}* OR tag:*${query}*`;
    } else {
      // If no query, return all products
      searchQuery = '*';
    }

    if (collection) {
      searchQuery += ` AND collection:${collection}`;
    }

    console.log('🔍 Final search query:', searchQuery);

    // GraphQL query to search products
    const graphqlQuery = `
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
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    sku
                    price
                    inventoryQuantity
                    availableForSale
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

    const variables = {
      query: searchQuery,
      first: Math.min(limit, 250) // Shopify limit
    };

    console.log('🚀 Executing GraphQL query:', { searchQuery, first: variables.first });

    const response = await admin.graphql(graphqlQuery, { variables });
    const result = await response.json();

    if (result.errors) {
      console.error('❌ GraphQL errors:', result.errors);
      return json({ error: "GraphQL query failed", details: result.errors }, { status: 400 });
    }

    // Transform the results to match our expected format
    const materials = result.data.products.edges.map((edge: any) => {
      const product = edge.node;
      const variant = product.variants.edges[0]?.node; // Get first variant

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

      return {
        id: variant?.id || product.id,
        variantId: variant?.id,
        code: variant?.sku || product.handle,
        name: product.title,
        productCode: variant?.sku || product.handle,
        availability: variant?.availableForSale ? 'available' : 'unavailable',
        warehouse: variant?.inventoryQuantity && variant.inventoryQuantity > 0 ? 'Available' : 'Out of Stock',
        price: {
          amount: parseFloat(variant?.price || "0"),
          currency: "EUR",
          perUnit: "/ ks"
        },
        quantity: variant?.inventoryQuantity || 0,
        // Additional data for debugging/reference
        _originalData: {
          title: product.title,
          handle: product.handle,
          vendor: product.vendor,
          productType: product.productType,
          tags: product.tags,
          variant: variant ? {
            id: variant.id,
            title: variant.title,
            sku: variant.sku,
            price: parseFloat(variant.price || "0"),
            inventoryQuantity: variant.inventoryQuantity,
            availableForSale: variant.availableForSale,
            metafields: variantMetafields
          } : null,
          metafields: productMetafields
        }
      };
    });

    console.log(`✅ Found ${materials.length} materials`);

    return json(materials);

  } catch (error) {
    console.error('💥 Error searching materials:', error);

    return json({
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 });
  }
}