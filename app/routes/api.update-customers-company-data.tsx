import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

// Types for structured error responses
interface FieldError {
  field: string;
  message: string;
}

interface ErrorResponse {
  success: false;
  message: string;
  fieldErrors?: FieldError[];
}

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
  console.log('🔄 Update customer metafields endpoint hit');

  if (request.method !== "POST") {
    return json({
      success: false,
      message: "Method not allowed"
    }, {
      status: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
      }
    });
  }

  try {
    // Parse request body
    const body = await request.json();
    const { customerEmail, metafields, shopDomain } = body;

    console.log('📝 Received update request:', { customerEmail, shopDomain, metafields });

    // Validate required fields
    if (!customerEmail) {
      return json({
        success: false,
        message: "Customer email is required"
      }, {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    if (!metafields || !Array.isArray(metafields)) {
      return json({
        success: false,
        message: "Metafields array is required"
      }, {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    // Get shop domain
    const shop = shopDomain || "iw-trend.myshopify.com";

    // Load session from storage
    const { sessionStorage } = await import("~/shopify.server");
    const sessionId = await sessionStorage.findSessionsByShop(shop);

    if (!sessionId || sessionId.length === 0) {
      console.error('❌ No session found for shop:', shop);
      return json({
        success: false,
        message: "No session found for shop. Make sure the app is installed."
      }, {
        status: 401,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    const session = sessionId[0];
    const accessToken = session.accessToken;

    if (!accessToken) {
      console.error('❌ No access token in session');
      return json({
        success: false,
        message: "No access token found in session"
      }, {
        status: 401,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    const { apiVersion } = await import("~/shopify.server");

    // Create GraphQL client
    const admin = {
      graphql: async (query: string, options?: { variables?: any }) => {
        const response = await fetch(`https://${shop}/admin/api/${apiVersion}/graphql.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': accessToken,
          },
          body: JSON.stringify({
            query,
            variables: options?.variables
          })
        });
        return {
          json: () => response.json()
        };
      }
    };

    console.log('✅ Session loaded for shop:', shop);

    // Step 1: Find customer by email
    console.log('🔍 Searching for customer by email:', customerEmail);

    const searchQuery = `
      query findCustomer($query: String!) {
        customers(first: 1, query: $query) {
          edges {
            node {
              id
              email
              firstName
              lastName
            }
          }
        }
      }
    `;

    const searchResponse = await admin.graphql(searchQuery, {
      variables: { query: `email:${customerEmail}` }
    });

    const searchResult = await searchResponse.json();

    if (searchResult.errors) {
      console.error('❌ GraphQL search errors:', searchResult.errors);
      return json({
        success: false,
        message: "Nastala chyba pri hľadaní zákazníka"
      }, {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    const customers = searchResult.data?.customers?.edges || [];

    if (customers.length === 0) {
      console.error('❌ Customer not found:', customerEmail);
      return json({
        success: false,
        message: "Zákazník nebol nájdený"
      }, {
        status: 404,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    const customer = customers[0].node;
    const customerId = customer.id;

    console.log('✅ Customer found:', { id: customerId, email: customer.email });

    // Step 2: Update customer metafields and notes
    console.log('📝 Updating customer metafields and notes...');

    // Prepare metafields input for GraphQL
    const metafieldsInput = metafields.map((mf: any) => ({
      namespace: mf.namespace || "custom",
      key: mf.key,
      value: String(mf.value || ""),
      type: "single_line_text_field"
    }));

    // Build notes from metafields - same format as in create-customer
    const noteLines: string[] = [];
    metafields.forEach((mf: any) => {
      if (mf.key === 'ico' && mf.value) {
        noteLines.push(`IČO: ${mf.value}`);
      } else if (mf.key === 'dic' && mf.value) {
        noteLines.push(`DIČ: ${mf.value}`);
      } else if (mf.key === 'nazov_firmy' && mf.value) {
        noteLines.push(`Firma: ${mf.value}`);
      }
    });
    const note = noteLines.join('\n');

    console.log('📝 Generated note:', note);

    const updateMutation = `
      mutation customerUpdate($input: CustomerInput!) {
        customerUpdate(input: $input) {
          customer {
            id
            email
            note
            metafields(first: 10, namespace: "custom") {
              edges {
                node {
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

    const updateVariables = {
      input: {
        id: customerId,
        metafields: metafieldsInput,
        ...(note && { note })
      }
    };

    const updateResponse = await admin.graphql(updateMutation, { variables: updateVariables });
    const updateResult = await updateResponse.json();

    console.log('📦 Update response:', JSON.stringify(updateResult, null, 2));

    // Check for errors
    if (updateResult.errors) {
      console.error('❌ GraphQL update errors:', updateResult.errors);
      return json({
        success: false,
        message: "Nastala chyba pri aktualizácii údajov"
      }, {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    if (updateResult.data?.customerUpdate?.userErrors?.length > 0) {
      console.error('❌ User errors:', updateResult.data.customerUpdate.userErrors);
      return json({
        success: false,
        message: "Nepodarilo sa aktualizovať údaje",
        details: updateResult.data.customerUpdate.userErrors
      }, {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    const updatedCustomer = updateResult.data?.customerUpdate?.customer;

    if (!updatedCustomer) {
      console.error('❌ No customer returned after update');
      return json({
        success: false,
        message: "Aktualizácia údajov zlyhala"
      }, {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    console.log('✅ Customer metafields and notes updated successfully');

    return json({
      success: true,
      message: "Údaje boli úspešne aktualizované",
      customer: {
        id: updatedCustomer.id,
        email: updatedCustomer.email,
        note: updatedCustomer.note,
        metafields: updatedCustomer.metafields?.edges?.map((edge: any) => ({
          namespace: edge.node.namespace,
          key: edge.node.key,
          value: edge.node.value
        })) || []
      }
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      }
    });

  } catch (error) {
    console.error('💥 Error updating customer metafields:', error);

    return json({
      success: false,
      message: error instanceof Error ? error.message : "Nastala neočakávaná chyba"
    }, {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      }
    });
  }
}
