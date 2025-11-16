/**
 * Application constants
 * Centralized configuration values used across the application
 */

// Shopify Collection IDs
// These IDs are used for filtering products by collection in GraphQL queries
export const COLLECTION_IDS = {
  BOARDS: '735247827326', // Porezove produkty (board materials)
  EDGES: '735538577790', // Hrany konfigurator (edge materials)
} as const;

// Shopify Collection Handles
export const COLLECTION_HANDLES = {
  BOARDS: 'porezove-produkty',
  EDGES: 'hrany-konfigurator',
} as const;

// Map collection handles to IDs for GraphQL filtering
// Used when frontend sends handle, we convert to ID for better query performance
export const COLLECTION_HANDLE_TO_ID: Record<string, string> = {
  [COLLECTION_HANDLES.BOARDS]: COLLECTION_IDS.BOARDS,
  [COLLECTION_HANDLES.EDGES]: COLLECTION_IDS.EDGES,
};
