import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";
import { COLLECTION_HANDLE_TO_ID } from "~/constants";
import {
  GET_NODE_BY_ID,
  SEARCH_PRODUCTS,
} from "~/graphql/queries";

export async function loader({ request }: LoaderFunctionArgs) {
  const DEBUG = process.env.NODE_ENV === 'development';

  if (DEBUG) console.log('🔍 Material search endpoint hit');

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
    const debugNoFilter = url.searchParams.get("debug_no_filter") === "true"; // Debug param to test without collection filter

    if (DEBUG) console.log('🔍 Search params:', { query, limit, collection, warehouse, debugNoFilter });

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
          searchQuery = `(title:*${query}* OR vendor:*${query}* OR product_type:*${query}* OR tag:*${query}* OR sku:*${query}* OR variant_id:${query} OR barcode:${query})`;
          console.log('🔍 Numeric search term detected, using enhanced search for:', query);
        } else {
          // Regular text search - include SKU field for product codes
          // Wrap in parentheses for proper AND precedence with collection filter
          searchQuery = `(title:*${query}* OR vendor:*${query}* OR product_type:*${query}* OR tag:*${query}* OR sku:*${query}*)`;
        }
      }
    } else {
      // If no query, return all products
      searchQuery = '*';
    }

    // Add collection filter to search query if specified
    if (collection && !debugNoFilter) {
      const collectionId = COLLECTION_HANDLE_TO_ID[collection];
      if (!collectionId) {
        console.warn('⚠️ Unknown collection handle:', collection);
        return json({ error: "Unknown collection" }, { status: 400 });
      }

      // Add collection_id filter to search query
      // Use AND to combine with existing search terms
      if (searchQuery && searchQuery !== '*') {
        searchQuery = `${searchQuery} AND collection_id:${collectionId}`;
      } else {
        searchQuery = `collection_id:${collectionId}`;
      }

      console.log('🔍 Added collection filter:', `${collection} → ${collectionId}`);
    }

    console.log('🔍 Final search query:', searchQuery);

    // Determine which API to use
    let graphqlQuery = '';
    let variables = {};

    // For direct GID lookups, use node() API as it's more reliable
    const isDirectGidLookup = query && query.startsWith('id:') && query.includes('gid://shopify/');

    if (isDirectGidLookup) {
      // Extract the GID from the query
      const gid = query.replace('id:', '').trim();
      console.log('🔍 Using node() API for direct GID lookup:', gid);

      graphqlQuery = GET_NODE_BY_ID;
      variables = {
        id: gid
      };
    } else {
      // Use products() search API - supports both collection filtering and text search in one query!
      console.log('🔍 Using products() API with query:', searchQuery);

      graphqlQuery = SEARCH_PRODUCTS;

      variables = {
        query: searchQuery,
        first: Math.min(limit, 250)
      };
    }

    console.log('🚀 Executing GraphQL query with variables:', JSON.stringify(variables, null, 2));

    // Helper function to extract alternative products from metafields
    const extractAlternativeProducts = (source: any): string | undefined => {
      if (source.alternativeProducts?.references?.edges) {
        const productGids = source.alternativeProducts.references.edges
          .map((edge: any) => edge.node?.id)
          .filter(Boolean);

        if (productGids.length > 0) {
          if (DEBUG) console.log('✅ [API] Resolved references:', productGids);
          return JSON.stringify(productGids);
        }
      }

      // Fallback to value if references aren't available
      return source.alternativeProducts?.value;
    };

    // Helper function to extract dimension metafields
    const extractDimensionMetafields = (source: any) => {
      const metafields: any = {};

      if (source.materialHeight?.value) {
        metafields['material.height'] = source.materialHeight.value;
      }
      if (source.materialWidth?.value) {
        metafields['material.width'] = source.materialWidth.value;
      }
      if (source.materialThickness?.value) {
        metafields['material.thickness'] = source.materialThickness.value;
      }

      // Extract edge-specific metafields
      if (source.edgeWidth?.value) {
        metafields['param.sirka_hrany'] = source.edgeWidth.value;
      }
      if (source.boardThickness?.value) {
        metafields['param.hrubka_hrany'] = source.boardThickness.value;
      }

      return metafields;
    };

    // Transform the results to match our expected format
    const transformToMaterial = (product: any, variant: any) => {
      // Initialize metafields objects (we query specific metafields, not allMetafields)
      const productMetafields: any = {};
      const variantMetafields: any = {};

      // Extract product metafields using helper functions
      const alternativeProducts = extractAlternativeProducts(product);
      if (alternativeProducts) {
        productMetafields['custom.alternative_products'] = alternativeProducts;
      }

      // Merge dimension metafields
      Object.assign(productMetafields, extractDimensionMetafields(product));

      // Add variant-specific metafields using helper functions
      if (variant) {
        const variantAlternativeProducts = extractAlternativeProducts(variant);
        if (variantAlternativeProducts) {
          variantMetafields['custom.alternative_products'] = variantAlternativeProducts;
        }

        // Merge dimension metafields
        Object.assign(variantMetafields, extractDimensionMetafields(variant));
      }

      // Merge metafields: variant metafields override product metafields
      const mergedMetafields = {
        ...productMetafields,
        ...variantMetafields
      };

      // Debug: Log all available metafields (only in development)
      if (DEBUG) {
        console.log('📦 Product metafields for', product.title, ':', Object.keys(productMetafields));
        if (variant) {
          console.log('📦 Variant metafields for', variant.title, ':', Object.keys(variantMetafields));
          console.log('📦 Variant inventory:', variant.inventoryQuantity);
        }
        console.log('📦 Merged metafields:', Object.keys(mergedMetafields));
        console.log('📦 Alternative products:', mergedMetafields['custom.alternative_products']);
      }

      // Get images - prefer variant image, fallback to product featured image
      const variantImage = variant?.image?.url;
      const productImage = product.featuredImage?.url;
      // Use featured image as the only image in the array for backward compatibility
      const productImages = productImage ? [productImage] : [];

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

    // Execute GraphQL query (single request for all searches now!)
    const response = await admin.graphql(graphqlQuery, { variables });
    const result: any = await response.json();

    // Debug: Log full response structure
    if (DEBUG) {
      console.log('📦 Full GraphQL response:', JSON.stringify(result, null, 2));
    } else {
      console.log('📦 GraphQL response summary:', {
        hasData: !!result.data,
        hasProducts: !!result.data?.products,
        productCount: result.data?.products?.edges?.length || 0,
        hasNode: !!result.data?.node,
        hasErrors: !!result.errors
      });
    }

    if (result.errors) {
      console.error('❌ GraphQL errors:', JSON.stringify(result.errors, null, 2));
      return json({ error: "GraphQL query failed", details: result.errors }, { status: 400 });
    }

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
      if (DEBUG) {
        console.log(`✅ products() API returned ${materials.length} products`);

        // Debug: Log product types and tags for first few results
        console.log('🔍 [DEBUG] First 5 products returned:');
        materials.slice(0, 5).forEach((mat: any, idx: number) => {
          console.log(`   ${idx + 1}. ${mat.title}`);
          console.log(`      Type: ${mat.productType}`);
          console.log(`      Tags: ${mat.tags?.join(', ') || 'none'}`);
        });
      }
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
