# GraphQL Queries & Mutations

Tato složka obsahuje všechny GraphQL dotazy pro Shopify Admin API.

## Struktura

```
app/graphql/
├── fragments.ts           # Sdílené GraphQL fragmenty
├── queries/              # Admin API queries
│   ├── index.ts         # Export všech queries
│   ├── getNodeById.ts   # Načtení produktu/varianty podle GID
│   ├── getCollectionProducts.ts  # Produkty z kolekce s paginací
│   └── searchProducts.ts         # Globální vyhledávání produktů
└── mutations/            # Admin API mutations (prázdné)
```

## Použití

### Import queries

```typescript
import {
  GET_NODE_BY_ID,
  GET_COLLECTION_PRODUCTS,
  SEARCH_PRODUCTS,
} from "~/graphql/queries";
```

### Fragmenty

Všechny queries používají sdílené fragmenty z `fragments.ts`:

- `PRODUCT_METAFIELDS_FRAGMENT` - metafieldy produktů
- `VARIANT_METAFIELDS_FRAGMENT` - metafieldy variant
- `VARIANT_FIELDS_FRAGMENT` - základní fields variant
- `PRODUCT_BASE_FIELDS_FRAGMENT` - základní fields produktů
- `PRODUCT_FULL_FIELDS_FRAGMENT` - kompletní fields produktů včetně variant

## Queries

### GET_NODE_BY_ID

Načte produkt nebo variantu podle Shopify GID.

**Parametry:**
- `id: ID!` - Shopify GID (např. `"gid://shopify/Product/123"`)

**Příklad použití:**
```typescript
const response = await admin.graphql(GET_NODE_BY_ID, {
  variables: { id: "gid://shopify/Product/123456" }
});
```

### GET_COLLECTION_PRODUCTS

Načte produkty z kolekce s podporou paginace.

**Parametry:**
- `collectionId: ID!` - Collection GID
- `first: Int!` - Počet produktů na stránku (max 250)
- `after: String` - Cursor pro další stránku (null pro první)

**Příklad použití:**
```typescript
const response = await admin.graphql(GET_COLLECTION_PRODUCTS, {
  variables: {
    collectionId: "gid://shopify/Collection/735247827326",
    first: 150,
    after: null
  }
});
```

### SEARCH_PRODUCTS

Globální vyhledávání produktů pomocí Shopify search syntax.

**Parametry:**
- `query: String!` - Vyhledávací dotaz (např. `"(title:*deska* OR sku:*123*)"`)
- `first: Int!` - Max počet výsledků (max 250)

**Příklad použití:**
```typescript
const response = await admin.graphql(SEARCH_PRODUCTS, {
  variables: {
    query: "(title:*deska* OR vendor:*EGGER*)",
    first: 50
  }
});
```

## Poznámky

- Všechny queries jsou optimalizované pro načítání metafields (sklady, rozměry, hrany)
- Fragmenty zajišťují konzistenci dat napříč všemi queries
- Max page size je 250 produktů (Shopify limit)
- Pro collection search se používá client-side filtrování (viz `api.search-materials.tsx`)
