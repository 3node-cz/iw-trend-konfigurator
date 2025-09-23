import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

export async function action({ request }: ActionFunctionArgs) {
  console.log('🔄 Update metafield endpoint hit');

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    // Authenticate with app proxy
    const { session, admin } = await authenticate.public.appProxy(request);

    if (!session?.shop) {
      return json({ error: "No shop session found" }, { status: 401 });
    }

    if (!admin) {
      return json({ error: "Admin API not available" }, { status: 401 });
    }

    // Parse request body
    const {
      customer_id,
      namespace,
      key,
      value,
      type = "multi_line_text_field"
    } = await request.json();

    if (!customer_id || !namespace || !key || value === undefined) {
      return json({
        error: "Missing required fields: customer_id, namespace, key, value"
      }, { status: 400 });
    }

    console.log('💾 Updating customer metafield:', {
      customer_id,
      namespace,
      key,
      valueLength: typeof value === 'string' ? value.length : 'not string'
    });

    // Update customer metafield using Admin API
    const mutation = `
      mutation customerUpdate($input: CustomerInput!) {
        customerUpdate(input: $input) {
          customer {
            id
            metafields(first: 5) {
              edges {
                node {
                  id
                  namespace
                  key
                  value
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        id: `gid://shopify/Customer/${customer_id}`,
        metafields: [
          {
            namespace,
            key,
            value,
            type
          }
        ]
      }
    };

    const response = await admin.graphql(mutation, { variables });
    const result = await response.json();

    if (result.data?.customerUpdate?.userErrors?.length > 0) {
      console.error('❌ GraphQL errors:', result.data.customerUpdate.userErrors);
      return json({
        success: false,
        error: "GraphQL errors",
        details: result.data.customerUpdate.userErrors
      }, { status: 400 });
    }

    console.log('✅ Customer metafield updated successfully');

    return json({
      success: true,
      message: "Metafield updated successfully",
      customer: result.data?.customerUpdate?.customer || null
    });

  } catch (error) {
    console.error('💥 Error updating metafield:', error);

    return json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 });
  }
}