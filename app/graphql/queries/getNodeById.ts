import {
  PRODUCT_FULL_FIELDS_FRAGMENT,
  PRODUCT_BASE_FIELDS_FRAGMENT,
  VARIANT_METAFIELDS_FRAGMENT,
} from "../fragments";

/**
 * GraphQL query pro načtení produktu nebo varianty podle GID
 * Podporuje jak Product tak ProductVariant typy
 *
 * @param id - Shopify GID (např. "gid://shopify/Product/123" nebo "gid://shopify/ProductVariant/456")
 */
export const GET_NODE_BY_ID = `
  query getNode($id: ID!) {
    node(id: $id) {
      ... on Product {
        ${PRODUCT_FULL_FIELDS_FRAGMENT}
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
          ${PRODUCT_BASE_FIELDS_FRAGMENT}
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
