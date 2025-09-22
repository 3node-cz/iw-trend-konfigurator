import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
  // Add CORS headers for cross-origin requests
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Shopify-Shop-Domain',
  };

  try {
    // Get the shop domain from headers
    const shopDomain = request.headers.get('x-shopify-shop-domain');

    if (!shopDomain) {
      return json(
        { success: false, error: "Shop domain not provided" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { customer_id, namespace, key, value, type } = body;

    // Validate required fields
    if (!customer_id || !namespace || !key || value === undefined) {
      return json(
        {
          success: false,
          error: "Missing required fields: customer_id, namespace, key, value"
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // For now, let's just log the data and return success
    // In a real implementation, you'd use your MCP client here
    console.log('Metafield update request:', {
      shopDomain,
      customer_id,
      namespace,
      key,
      value: value.substring(0, 100) + '...' // Log first 100 chars
    });

    // TODO: Replace this with actual MCP integration
    // For now, simulate success to test the flow
    return json(
      {
        success: true,
        message: "Metafield update simulated successfully",
        customer_id,
        metafield: { namespace, key, value }
      },
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error updating customer metafield:', error);
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      },
      { status: 500, headers: corsHeaders }
    );
  }
};

// Handle OPTIONS for CORS preflight
export const loader = async ({ request }: ActionFunctionArgs) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Shopify-Shop-Domain',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  return json(
    { error: "Method not allowed. Use POST to update customer metafields." },
    { status: 405, headers: corsHeaders }
  );
};