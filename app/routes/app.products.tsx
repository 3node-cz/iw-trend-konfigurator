import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout, Card, DataTable, Button } from "@shopify/polaris";
import { mcpClient } from "~/utils/mcp-client";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    await mcpClient.connect();
    const products = await mcpClient.getProducts();

    return json({
      products: products.content || [],
      success: true,
    });
  } catch (error) {
    console.error("Error loading products:", error);
    return json({
      products: [],
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export default function Products() {
  const { products, success, error } = useLoaderData<typeof loader>();

  const rows = success && Array.isArray(products)
    ? products.map((product: any) => [
        product.id,
        product.title || "",
        product.vendor || "",
        product.product_type || "",
        product.status || "",
        <Button key={product.id} size="slim">Edit</Button>
      ])
    : [];

  return (
    <Page title="Products">
      <Layout>
        <Layout.Section>
          <Card>
            {!success ? (
              <div style={{ padding: "20px", textAlign: "center" }}>
                <p>Error loading products: {error}</p>
                <p>Make sure your MCP server is configured correctly.</p>
              </div>
            ) : (
              <DataTable
                columnContentTypes={["text", "text", "text", "text", "text", "text"]}
                headings={["ID", "Title", "Vendor", "Type", "Status", "Actions"]}
                rows={rows}
              />
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}