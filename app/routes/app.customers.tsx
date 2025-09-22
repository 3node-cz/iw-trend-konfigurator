import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout, Card, DataTable, Button } from "@shopify/polaris";
import { mcpClient } from "~/utils/mcp-client";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    // Connect to MCP server and get customers
    await mcpClient.connect();
    const customers = await mcpClient.getCustomers();

    return json({
      customers: customers.content || [],
      success: true,
    });
  } catch (error) {
    console.error("Error loading customers:", error);
    return json({
      customers: [],
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export default function Customers() {
  const { customers, success, error } = useLoaderData<typeof loader>();

  const rows = success && Array.isArray(customers)
    ? customers.map((customer: any) => [
        customer.id,
        customer.first_name || "",
        customer.last_name || "",
        customer.email || "",
        customer.phone || "",
        <Button key={customer.id} size="slim">Edit</Button>
      ])
    : [];

  return (
    <Page title="Customers">
      <Layout>
        <Layout.Section>
          <Card>
            {!success ? (
              <div style={{ padding: "20px", textAlign: "center" }}>
                <p>Error loading customers: {error}</p>
                <p>Make sure your MCP server is configured correctly.</p>
              </div>
            ) : (
              <DataTable
                columnContentTypes={["text", "text", "text", "text", "text", "text"]}
                headings={["ID", "First Name", "Last Name", "Email", "Phone", "Actions"]}
                rows={rows}
              />
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}