import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    // Authenticate the request
    const { admin } = await authenticate.admin(request);

    // Parse the request body
    const body = await request.json();
    const { customer_id, namespace, key, value, type } = body;

    // Validate required fields
    if (!customer_id || !namespace || !key || !value) {
      return json(
        {
          success: false,
          error: "Missing required fields: customer_id, namespace, key, value"
        },
        { status: 400 }
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
            type: type || "multi_line_text_field"
          }
        ]
      }
    };

    console.log('Updating customer metafield:', variables);

    // Execute the GraphQL mutation
    const response = await admin.graphql(mutation, { variables });
    const data = await response.json();

    console.log('GraphQL response:', JSON.stringify(data, null, 2));

    // Check for GraphQL errors
    if (data.data?.customerUpdate?.userErrors?.length > 0) {
      const errors = data.data.customerUpdate.userErrors;
      console.error('Customer update errors:', errors);
      return json(
        {
          success: false,
          error: errors.map((e: any) => e.message).join(', '),
          details: errors
        },
        { status: 400 }
      );
    }

    // Check if the mutation was successful
    if (data.data?.customerUpdate?.customer) {
      return json({
        success: true,
        message: "Customer metafield updated successfully",
        customer_id,
        metafield: { namespace, key, value }
      });
    } else {
      console.error('Unexpected GraphQL response:', data);
      return json(
        {
          success: false,
          error: "Failed to update customer metafield",
          details: data
        },
        { status: 500 }
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
      { status: 500 }
    );
  }
};

// Only allow POST requests
export const loader = () => {
  return json(
    { error: "Method not allowed. Use POST to update customer metafields." },
    { status: 405 }
  );
};