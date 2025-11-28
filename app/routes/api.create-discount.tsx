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
  console.log('🎯 Create discount endpoint hit');

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
    const { customerId, discountAmount } = await request.json();

    if (!customerId || !discountAmount) {
      return json({
        error: "Missing required fields: customerId, discountAmount"
      }, {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    console.log('💰 Creating discount:', {
      customerId,
      discountAmount
    });

    // Generate unique discount code
    const timestamp = Date.now();
    const discountCode = `CUSTOM-${customerId}-${timestamp}`;

    // Create discount code using GraphQL Admin API
    const mutation = `
      mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
        discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
          codeDiscountNode {
            id
            codeDiscount {
              ... on DiscountCodeBasic {
                title
                codes(first: 1) {
                  edges {
                    node {
                      code
                    }
                  }
                }
                startsAt
                endsAt
                customerGets {
                  value {
                    ... on DiscountAmount {
                      amount {
                        amount
                        currencyCode
                      }
                      appliesOnEachItem
                    }
                  }
                  items {
                    ... on AllDiscountItems {
                      allItems
                    }
                  }
                }
                customerSelection {
                  ... on DiscountCustomers {
                    customers {
                      id
                    }
                  }
                }
                usageLimit
              }
            }
          }
          userErrors {
            field
            message
            code
          }
        }
      }
    `;

    const variables = {
      basicCodeDiscount: {
        title: `Custom Price Discount - Customer ${customerId}`,
        code: discountCode,
        startsAt: new Date().toISOString(),
        endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        customerSelection: {
          customers: {
            add: [`gid://shopify/Customer/${customerId}`]
          }
        },
        customerGets: {
          value: {
            discountAmount: {
              amount: parseFloat(discountAmount),
              appliesOnEachItem: false
            }
          },
          items: {
            all: true
          }
        },
        appliesOncePerCustomer: true,
        usageLimit: 1
      }
    };

    const response = await admin.graphql(mutation, { variables });
    const result = await response.json();

    // Log the full response for debugging
    console.log('📦 GraphQL Response:', JSON.stringify(result, null, 2));

    // Check for GraphQL errors (cast to any to avoid TS error)
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

    if (result.data?.discountCodeBasicCreate?.userErrors?.length > 0) {
      console.error('❌ User errors:', JSON.stringify(result.data.discountCodeBasicCreate.userErrors, null, 2));
      return json({
        success: false,
        error: "Failed to create discount",
        details: result.data.discountCodeBasicCreate.userErrors
      }, {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    if (!result.data?.discountCodeBasicCreate?.codeDiscountNode) {
      console.error('❌ No discount node returned:', JSON.stringify(result, null, 2));
      return json({
        success: false,
        error: "Discount creation returned null"
      }, {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    console.log('✅ Discount created successfully:', discountCode);

    return json({
      success: true,
      discountCode: discountCode,
      message: "Discount code created successfully"
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      }
    });

  } catch (error) {
    console.error('💥 Error creating discount:', error);

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
