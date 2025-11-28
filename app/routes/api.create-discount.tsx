import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

export async function action({ request }: ActionFunctionArgs) {
  console.log('🎯 Create discount endpoint hit');

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
    const { customerId, discountAmount } = await request.json();

    if (!customerId || !discountAmount) {
      return json({
        error: "Missing required fields: customerId, discountAmount"
      }, { status: 400 });
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

    if (result.data?.discountCodeBasicCreate?.userErrors?.length > 0) {
      console.error('❌ GraphQL errors:', result.data.discountCodeBasicCreate.userErrors);
      return json({
        success: false,
        error: "Failed to create discount",
        details: result.data.discountCodeBasicCreate.userErrors
      }, { status: 400 });
    }

    console.log('✅ Discount created successfully:', discountCode);

    return json({
      success: true,
      discountCode: discountCode,
      message: "Discount code created successfully"
    });

  } catch (error) {
    console.error('💥 Error creating discount:', error);

    return json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 });
  }
}
