import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

// Handle CORS preflight
export async function loader({ request }: LoaderFunctionArgs) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
  return json({ error: "Method not allowed" }, { status: 405 });
}

export async function action({ request }: ActionFunctionArgs) {
  console.log('💳 Set customer VAT endpoint hit');

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, {
      status: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
      }
    });
  }

  try {
    // Authenticate with app proxy
    const { session, admin } = await authenticate.public.appProxy(request);

    if (!session?.shop) {
      return json({ error: "No shop session found" }, {
        status: 401,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    if (!admin) {
      return json({ error: "Admin API not available" }, {
        status: 401,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    // Parse request body
    const { customerId, ico } = await request.json();

    // Validate required fields
    if (!customerId || !ico) {
      return json({
        error: "Missing required fields: customerId, ico"
      }, {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    console.log('📝 Setting VAT number for customer:', {
      customerId,
      ico
    });

    // Update customer with VAT registration using GraphQL Admin API
    const mutation = `
      mutation customerUpdate($input: CustomerInput!) {
        customerUpdate(input: $input) {
          customer {
            id
            firstName
            lastName
            email
            taxExempt
            taxExemptions
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    // Prepare customer input with tax registration
    const customerInput = {
      id: customerId.startsWith('gid://') ? customerId : `gid://shopify/Customer/${customerId}`,
      taxExemptions: ["INTL_TAX_ID"],
      taxExempt: false,
      // Store IČO as metafield for VAT number
      metafields: [
        {
          namespace: "custom",
          key: "vat_number",
          value: ico,
          type: "single_line_text_field"
        }
      ]
    };

    const variables = {
      input: customerInput
    };

    const response = await admin.graphql(mutation, { variables });
    const result = await response.json();

    // Log the full response for debugging
    console.log('📦 GraphQL Response:', JSON.stringify(result, null, 2));

    // Check for GraphQL errors
    const resultData = result as any;
    if (resultData.errors) {
      console.error('❌ GraphQL errors:', JSON.stringify(resultData.errors, null, 2));
      return json({
        success: false,
        error: "GraphQL error",
        details: resultData.errors
      }, {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    if (result.data?.customerUpdate?.userErrors?.length > 0) {
      console.error('❌ User errors:', JSON.stringify(result.data.customerUpdate.userErrors, null, 2));
      return json({
        success: false,
        error: "Failed to update customer VAT",
        details: result.data.customerUpdate.userErrors
      }, {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    if (!result.data?.customerUpdate?.customer) {
      console.error('❌ No customer returned:', JSON.stringify(result, null, 2));
      return json({
        success: false,
        error: "Customer update returned null"
      }, {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    const customer = result.data.customerUpdate.customer;
    console.log('✅ VAT number set successfully for customer:', customer.id);

    return json({
      success: true,
      customer: {
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        taxExempt: customer.taxExempt,
        taxExemptions: customer.taxExemptions,
        vatNumber: ico
      },
      message: "VAT number set successfully"
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      }
    });

  } catch (error) {
    console.error('💥 Error setting customer VAT:', error);

    return json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }, {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      }
    });
  }
}
