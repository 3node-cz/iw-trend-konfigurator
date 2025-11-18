import { PRODUCT_FULL_FIELDS_FRAGMENT } from "../fragments";

/**
 * GraphQL query pro globální vyhledávání produktů
 * Používá Shopify search syntax (title:*, vendor:*, sku:*, atd.)
 *
 * @param query - Vyhledávací dotaz (např. "(title:*deska* OR sku:*123*)")
 * @param first - Maximální počet výsledků (max 250)
 */
export const SEARCH_PRODUCTS = `
  query searchProducts($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
      edges {
        node {
          ${PRODUCT_FULL_FIELDS_FRAGMENT}
        }
      }
    }
  }
`;
