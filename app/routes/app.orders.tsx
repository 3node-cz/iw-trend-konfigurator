import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout, Card, DataTable, Button, Badge } from "@shopify/polaris";
import { mcpClient } from "~/utils/mcp-client";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    await mcpClient.connect();
    const orders = await mcpClient.getOrders();

    return json({
      orders: orders.content || [],
      success: true,
    });
  } catch (error) {
    console.error("Error loading orders:", error);
    return json({
      orders: [],
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export default function Orders() {
  const { orders, success, error } = useLoaderData<typeof loader>();

  const rows = success && Array.isArray(orders)
    ? orders.map((order: any) => [
        order.id,
        order.name || "",
        order.customer?.email || "Guest",
        order.total_price || "0.00",
        <Badge key={`${order.id}-status`} status={order.fulfillment_status === "fulfilled" ? "success" : "attention"}>
          {order.fulfillment_status || "pending"}
        </Badge>,
        <Button key={order.id} size="slim">View</Button>
      ])
    : [];

  return (
    <Page title="Orders">
      <Layout>
        <Layout.Section>
          <Card>
            {!success ? (
              <div style={{ padding: "20px", textAlign: "center" }}>
                <p>Error loading orders: {error}</p>
                <p>Make sure your MCP server is configured correctly.</p>
              </div>
            ) : (
              <DataTable
                columnContentTypes={["text", "text", "text", "text", "text", "text"]}
                headings={["ID", "Order Number", "Customer", "Total", "Status", "Actions"]}
                rows={rows}
              />
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}