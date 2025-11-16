import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";
import { COLLECTION_HANDLE_TO_ID } from "~/constants";

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
      if (query.startsWith('id:')) {
        // Extract the ID part after "id:"
        const idPart = query.replace('id:', '');

        if (idPart.startsWith('gid://shopify/')) {
          // Already a full GID
          console.log('🔍 Shopify GID search detected:', idPart);
          searchQuery = `id:${idPart}`;
        } else if (/^\d+$/.test(idPart)) {
          // Numeric ID - convert to full GID
          const fullGid = `gid://shopify/Product/${idPart}`;
          console.log('🔍 Numeric product ID detected, converting:', idPart, '->', fullGid);
          searchQuery = `id:${fullGid}`;
        } else {
          // Some other format, use as-is
          console.log('🔍 Unknown ID format:', idPart);
          searchQuery = `id:${idPart}`;
        }
      } else {
        // Check if it's a plain numeric ID (like from old variant IDs)
        if (/^\d+$/.test(query)) {
          // For numeric queries, search across multiple fields including variant IDs and SKUs
          searchQuery = `title:*${query}* OR vendor:*${query}* OR product_type:*${query}* OR tag:*${query}* OR sku:*${query}* OR variant_id:${query} OR barcode:${query}`;
          console.log('🔍 Numeric search term detected, using enhanced search for:', query);
        } else {
          // Regular text search - include SKU field for product codes
          searchQuery = `title:*${query}* OR vendor:*${query}* OR product_type:*${query}* OR tag:*${query}* OR sku:*${query}*`;
        }
      }
    } else {
      // If no query, return all products
      searchQuery = '*';
    }

    // Add collection filter to search query if specified
    // Convert collection handle to ID for proper GraphQL filtering
    if (collection) {
      const collectionId = COLLECTION_HANDLE_TO_ID[collection];
      if (collectionId) {
        searchQuery += ` AND collection_id:${collectionId}`;
        console.log('🔍 Collection filter:', `${collection} → ID: ${collectionId}`);
      } else {
        console.warn('⚠️ Unknown collection handle:', collection);
      }
    }

    console.log('🔍 Final search query:', searchQuery);

    // Choose GraphQL query based on search type
    let graphqlQuery = '';
    let variables = {};

    // For direct GID lookups, use node() API as it's more reliable
    // For other searches, use products() search API
    const isDirectGidLookup = query && query.startsWith('id:') && query.includes('gid://shopify/');

    if (isDirectGidLookup) {
      // Extract the GID from the query
      const gid = query.replace('id:', '').trim();
      console.log('🔍 Using node() API for direct GID lookup:', gid);

      graphqlQuery = `
        query getNode($id: ID!) {
          node(id: $id) {
            ... on Product {
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
                        references(first: 10) {
                          edges {
                            node {
                              ... on Product {
                                id
                                title
                                handle
                              }
                            }
                          }
                        }
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
                  references(first: 10) {
                    edges {
                      node {
                        ... on Product {
                          id
                          title
                          handle
                        }
                      }
                    }
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
              localWarehouseStock: metafield(namespace: "custom", key: "local_warehouse_stock") {
                value
              }
              remoteWarehouseStock: metafield(namespace: "custom", key: "remote_warehouse_stock") {
                value
              }
              alternativeProducts: metafield(namespace: "custom", key: "alternative_products") {
                value
                references(first: 10) {
                  edges {
                    node {
                      ... on ProductVariant {
                        id
                      }
                    }
                  }
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
        id: gid
      };
    } else {
      // Use products() search API for text searches
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
                        references(first: 10) {
                          edges {
                            node {
                              ... on Product {
                                id
                                title
                                handle
                              }
                            }
                          }
                        }
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
                  references(first: 10) {
                    edges {
                      node {
                        ... on Product {
                          id
                          title
                          handle
                        }
                      }
                    }
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

    console.log('📦 Raw GraphQL response (first product):', JSON.stringify(result?.data?.products?.edges?.[0] || result?.data?.node || result?.data?.collection?.products?.edges?.[0], null, 2));

    if (result.errors) {
      console.error('❌ GraphQL errors:', JSON.stringify(result.errors, null, 2));
      return json({ error: "GraphQL query failed", details: result.errors }, { status: 400 });
    }

    // Check for errors in the response body (GraphQL client wrapper errors)
    if (response.body?.errors) {
      console.error('❌ GraphQL body errors:', JSON.stringify(response.body.errors, null, 2));
      // Log the graphQLErrors array specifically
      if (response.body.errors.graphQLErrors) {
        console.error('❌ Detailed GraphQL errors:', JSON.stringify(response.body.errors.graphQLErrors, null, 2));
      }
      return json({
        error: "GraphQL query failed",
        details: response.body.errors.graphQLErrors || response.body.errors
      }, { status: 400 });
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
      console.log('🔍 [API] Checking product.alternativeProducts:', {
        exists: !!product.alternativeProducts,
        value: product.alternativeProducts?.value,
        references: product.alternativeProducts?.references,
        fullObject: product.alternativeProducts,
      });

      // For list.product_reference metafields, use the resolved references
      // Extract the GIDs from the references field
      if (product.alternativeProducts?.references?.edges) {
        const productGids = product.alternativeProducts.references.edges
          .map((edge: any) => edge.node?.id)
          .filter(Boolean);

        if (productGids.length > 0) {
          productMetafields['custom.alternative_products'] = JSON.stringify(productGids);
          console.log('✅ [API] Resolved product references:', productGids);
        }
      } else if (product.alternativeProducts?.value) {
        // Fallback to value if references aren't available
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
        console.log('🔍 [API] Checking variant.alternativeProducts:', {
          exists: !!variant.alternativeProducts,
          value: variant.alternativeProducts?.value,
          references: variant.alternativeProducts?.references,
          fullObject: variant.alternativeProducts,
        });

        // For list.product_reference metafields, use the resolved references
        if (variant.alternativeProducts?.references?.edges) {
          const variantGids = variant.alternativeProducts.references.edges
            .map((edge: any) => edge.node?.id)
            .filter(Boolean);

          if (variantGids.length > 0) {
            variantMetafields['custom.alternative_products'] = JSON.stringify(variantGids);
            console.log('✅ [API] Resolved variant references:', variantGids);
          }
        } else if (variant.alternativeProducts?.value) {
          // Fallback to value if references aren't available
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

    // Handle different API response types
    let materials = [];

    if (isDirectGidLookup && result.data.node) {
      // Handle node() API response (direct GID lookup)
      const node = result.data.node;

      // Check if it's a ProductVariant or Product
      if (node.product) {
        // It's a ProductVariant - node has .product and is itself the variant
        console.log('✅ node() API returned ProductVariant');
        materials = [transformToMaterial(node.product, node)];
      } else if (node.variants) {
        // It's a Product - node has .variants
        console.log('✅ node() API returned Product');
        const variant = node.variants.edges[0]?.node;
        materials = [transformToMaterial(node, variant)];
      } else {
        console.log('⚠️ node() API returned unknown node type');
      }
    } else if (result.data.products) {
      // Handle products() search API response
      materials = result.data.products.edges.map((edge: any) => {
        const product = edge.node;
        const variant = product.variants.edges[0]?.node;
        return transformToMaterial(product, variant);
      });
      console.log(`✅ products() API returned ${materials.length} products`);

      // Debug: Log product types and tags for first few results
      console.log('🔍 [DEBUG] First 5 products returned:');
      materials.slice(0, 5).forEach((mat: any, idx: number) => {
        console.log(`   ${idx + 1}. ${mat.title}`);
        console.log(`      Type: ${mat.productType}`);
        console.log(`      Tags: ${mat.tags?.join(', ') || 'none'}`);
      });
    }

    console.log(`✅ Returning ${materials.length} materials`);

    return json(materials);

  } catch (error) {
    console.error('💥 Error searching materials:', error);

    return json({
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 });
  }
}