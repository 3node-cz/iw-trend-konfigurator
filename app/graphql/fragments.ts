/**
 * Sdílené GraphQL fragmenty pro Admin API dotazy
 * Tyto fragmenty definují společná pole pro produkty, varianty a metafieldy
 */

/**
 * Fragment pro metafieldy produktů
 */
export const PRODUCT_METAFIELDS_FRAGMENT = `
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
`;

/**
 * Fragment pro metafieldy variant
 */
export const VARIANT_METAFIELDS_FRAGMENT = `
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
  edgeWidth: metafield(namespace: "param", key: "sirka_hrany") {
    value
  }
  boardThickness: metafield(namespace: "param", key: "hrubka_hrany") {
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
`;

/**
 * Fragment pro základní informace o variantě
 */
export const VARIANT_FIELDS_FRAGMENT = `
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
  ${VARIANT_METAFIELDS_FRAGMENT}
`;

/**
 * Fragment pro základní informace o produktu (bez variant)
 */
export const PRODUCT_BASE_FIELDS_FRAGMENT = `
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
`;

/**
 * Fragment pro kompletní informace o produktu včetně variant
 */
export const PRODUCT_FULL_FIELDS_FRAGMENT = `
  ${PRODUCT_BASE_FIELDS_FRAGMENT}
  variants(first: 10) {
    edges {
      node {
        ${VARIANT_FIELDS_FRAGMENT}
      }
    }
  }
  ${PRODUCT_METAFIELDS_FRAGMENT}
`;
