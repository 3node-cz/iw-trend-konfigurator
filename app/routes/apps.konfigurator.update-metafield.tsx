import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    // Get the shop domain from headers (App Proxy parameter)
    const shopDomain = request.headers.get('x-shopify-shop-domain') ||
                      new URL(request.url).searchParams.get('shop');

    if (!shopDomain) {
      return json(
        { success: false, error: "Shop domain not provided" },
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
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
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    // This is an App Proxy route, so we need to use the Shopify Admin API directly
    // You'll need to get the access token for this shop
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN; // Set this in your .env

    if (!accessToken) {
      return json(
        { success: false, error: "Shopify access token not configured" },
        {
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    // Create the metafield using REST API (easier for App Proxy)
    const metafieldData = {
      metafield: {
        namespace,
        key,
        value,
        type: type || "multi_line_text_field"
      }
    };

    console.log('Updating customer metafield via App Proxy:', {
      shopDomain,
      customer_id,
      metafieldData
    });

    // Make REST API call to Shopify
    const shopifyApiUrl = `https://${shopDomain}/admin/api/2023-10/customers/${customer_id}/metafields.json`;

    const response = await fetch(shopifyApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken
      },
      body: JSON.stringify(metafieldData)
    });

    const data = await response.json();

    console.log('Shopify API response:', data);

    if (response.ok && data.metafield) {
      return json(
        {
          success: true,
          message: "Customer metafield updated successfully",
          customer_id,
          metafield: data.metafield
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    } else {
      console.error('Shopify API error:', data);
      return json(
        {
          success: false,
          error: data.errors || "Failed to update customer metafield",
          details: data
        },
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

  } catch (error) {
    console.error('Error updating customer metafield:', error);
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        details: error
      },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  }
};

// Handle OPTIONS for CORS
export const loader = async ({ request }: ActionFunctionArgs) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  return json(
    { error: "Method not allowed. Use POST to update customer metafields." },
    {
      status: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    }
  );
};