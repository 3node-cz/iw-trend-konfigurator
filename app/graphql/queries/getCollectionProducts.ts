import { PRODUCT_FULL_FIELDS_FRAGMENT } from "../fragments";

/**
 * GraphQL query pro načtení produktů z kolekce s paginací
 * Používá se pro filtrování podle kolekce (např. boards, edges)
 *
 * @param collectionId - Shopify Collection GID (např. "gid://shopify/Collection/735247827326")
 * @param first - Počet produktů na stránku (max 250)
 * @param after - Cursor pro paginaci (null pro první stránku)
 */
export const GET_COLLECTION_PRODUCTS = `
  query getCollectionProducts($collectionId: ID!, $first: Int!, $after: String) {
    collection(id: $collectionId) {
      id
      title
      handle
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            ${PRODUCT_FULL_FIELDS_FRAGMENT}
          }
        }
      }
    }
  }
`;
