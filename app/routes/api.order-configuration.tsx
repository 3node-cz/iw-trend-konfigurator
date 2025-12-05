import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

/**
 * Public API endpoint to fetch order configuration by order ID
 * No authentication required - anyone with order ID can view
 *
 * Usage: /apps/configurator/api/order-configuration?orderId=5891234567890
 */
export async function loader({ request }: LoaderFunctionArgs) {
  // Handle OPTIONS for CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  const DEBUG = process.env.NODE_ENV === 'development';

  if (DEBUG) console.log('📦 Order configuration endpoint hit');

  try {
    // Authenticate with app proxy (public access)
    const { admin } = await authenticate.public.appProxy(request);

    if (!admin) {
      return json({
        success: false,
        error: "Admin API not available"
      }, {
        status: 401,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    // Parse query parameters
    const url = new URL(request.url);
    const orderId = url.searchParams.get("orderId");

    if (!orderId) {
      return json({
        success: false,
        error: "Missing orderId parameter"
      }, {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    // Convert to GID if numeric
    const orderGid = orderId.startsWith('gid://shopify/Order/')
      ? orderId
      : `gid://shopify/Order/${orderId}`;

    console.log('🔍 Fetching order configuration:', orderGid);

    // GraphQL query to fetch order with configuration metafield
    const query = `
      query getOrderConfiguration($id: ID!) {
        order(id: $id) {
          id
          name
          createdAt
          updatedAt
          customer {
            id
            email
            firstName
            lastName
          }
          metafield(namespace: "custom", key: "order_configuration") {
            value
          }
        }
      }
    `;

    const response = await admin.graphql(query, {
      variables: { id: orderGid }
    });

    const data = await response.json();

    if (DEBUG) console.log('📦 GraphQL response:', JSON.stringify(data, null, 2));

    const order = data.data?.order;

    if (!order) {
      console.warn('⚠️ Order not found:', orderGid);
      return json({
        success: false,
        error: "Order not found",
        details: "The order ID does not exist or has been deleted"
      }, {
        status: 404,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    if (!order.metafield?.value) {
      console.warn('⚠️ No configuration found for order:', orderGid);
      return json({
        success: false,
        error: "No configuration found",
        details: "This order does not have a configuration attached"
      }, {
        status: 404,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    // Parse configuration from metafield
    let configuration;
    try {
      configuration = JSON.parse(order.metafield.value);
    } catch (parseError) {
      console.error('❌ Failed to parse configuration JSON:', parseError);
      return json({
        success: false,
        error: "Invalid configuration data",
        details: "The configuration data is corrupted"
      }, {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    console.log('✅ Configuration loaded successfully for order:', order.name);

    return json({
      success: true,
      order: {
        id: order.id,
        name: order.name,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        // Don't expose customer data publicly (privacy/security)
      },
      configuration,
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      }
    });

  } catch (error) {
    console.error('❌ Error fetching order configuration:', error);
    return json({
      success: false,
      error: "Failed to fetch order configuration",
      details: "An internal error occurred. Please try again or contact support."
    }, {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      }
    });
  }
}
