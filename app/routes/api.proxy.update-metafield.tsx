import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    // For app proxy, we need to use authenticate.public
    const { session, admin } = await authenticate.public.appProxy(request);

    if (!session) {
      return json(
        { success: false, error: "No valid session found" },
        { status: 401 },
      );
    }

    console.log("🔗 App Proxy session:", session.shop);

    // Parse the request body
    const body = await request.json();
    const { customer_id, namespace, key, value, type } = body;

    // Validate required fields
    if (!customer_id || !namespace || !key || value === undefined) {
      return json(
        {
          success: false,
          error: "Missing required fields: customer_id, namespace, key, value",
        },
        { status: 400 },
      );
    }

    // Create the metafield using GraphQL
    const mutation = `
      mutation customerUpdate($input: CustomerInput!) {
        customerUpdate(input: $input) {
          customer {
            id
            metafields(first: 10) {
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

    // Prepare the GraphQL variables
    const variables = {
      input: {
        id: `gid://shopify/Customer/${customer_id}`,
        metafields: [
          {
            namespace,
            key,
            value,
            type: type || "multi_line_text_field",
          },
        ],
      },
    };

    console.log("🚀 Updating customer metafield via app proxy:", {
      customer_id,
      namespace,
      key,
      valueLength: value.length,
      shop: session.shop,
    });

    // Execute the GraphQL mutation
    const response = await admin.graphql(mutation, { variables });
    const data = await response.json();

    console.log("📦 GraphQL response:", JSON.stringify(data, null, 2));

    // Check for GraphQL errors
    if (data.data?.customerUpdate?.userErrors?.length > 0) {
      const errors = data.data.customerUpdate.userErrors;
      console.error("❌ Customer update errors:", errors);
      return json(
        {
          success: false,
          error: errors.map((e: any) => e.message).join(", "),
          details: errors,
        },
        { status: 400 },
      );
    }

    // Check if the mutation was successful
    if (data.data?.customerUpdate?.customer) {
      console.log("✅ Metafield updated successfully via app proxy");
      return json({
        success: true,
        message: "Customer metafield updated successfully",
        customer_id,
        metafield: { namespace, key, value: value.substring(0, 100) + "..." },
      });
    } else {
      console.error("❌ Unexpected GraphQL response:", data);
      return json(
        {
          success: false,
          error: "Failed to update customer metafield",
          details: data,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("💥 Error in app proxy route:", error);
    return json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        details: error,
      },
      { status: 500 },
    );
  }
};

// Handle GET requests (app proxy verification)
export const loader = async ({ request }: LoaderFunctionArgs) => {
  return null;
  // try {
  //   const { session } = await authenticate.public.appProxy(request);
  //   return json({
  //     message: "App Proxy is working",
  //     shop: session?.shop,
  //     timestamp: new Date().toISOString()
  //   });
  // } catch (error) {
  //   return json(
  //     { error: "App proxy verification failed" },
  //     { status: 500 }
  //   );
  // }
};
