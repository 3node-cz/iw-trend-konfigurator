import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

export async function action({ request }: ActionFunctionArgs) {
  console.log('🛒 Create cart/draft order endpoint hit');

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
    const body = await request.json();
    const { items = [], customerInfo = {}, orderAttributes = {} } = body;

    console.log('🛒 Creating draft order with items:', items);

    // Create draft order using Admin API - better for B2B scenarios
    const draftOrderCreateMutation = `
      mutation draftOrderCreate($input: DraftOrderInput!) {
        draftOrderCreate(input: $input) {
          draftOrder {
            id
            name
            invoiceUrl
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 100) {
              edges {
                node {
                  id
                  title
                  quantity
                  originalUnitPrice {
                    amount
                    currencyCode
                  }
                  variant {
                    id
                    title
                    product {
                      title
                      handle
                    }
                  }
                  customAttributes {
                    key
                    value
                  }
                }
              }
            }
            customAttributes {
              key
              value
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    // Transform items to draft order line items format
    const lineItems = items.map((item: any) => ({
      variantId: item.variantId,
      quantity: item.quantity || 1,
      customAttributes: item.attributes || [],
      // Add custom pricing if needed
      ...(item.customPrice && {
        originalUnitPrice: item.customPrice
      })
    }));

    const variables = {
      input: {
        lineItems,
        customAttributes: [
          ...Object.entries(orderAttributes).map(([key, value]) => ({
            key,
            value: typeof value === 'string' ? value : JSON.stringify(value)
          })),
          {
            key: '_order_source',
            value: 'cutting_configurator'
          },
          {
            key: '_created_at',
            value: new Date().toISOString()
          }
        ],
        // Add customer info if provided
        ...(customerInfo.email && {
          email: customerInfo.email
        }),
        ...(customerInfo.shippingAddress && {
          shippingAddress: customerInfo.shippingAddress
        }),
        ...(customerInfo.note && {
          note: customerInfo.note
        })
      }
    };

    console.log('🚀 Executing draft order create mutation:', variables);

    const response = await admin.graphql(draftOrderCreateMutation, { variables });
    const result = await response.json();

    if (result.errors) {
      console.error('❌ GraphQL errors:', result.errors);
      return json({ error: "Draft order creation failed", details: result.errors }, { status: 400 });
    }

    const draftOrderData = result.data.draftOrderCreate;

    // Handle user errors
    if (draftOrderData.userErrors?.length > 0) {
      console.error('❌ User errors:', draftOrderData.userErrors);
      return json({
        error: "Draft order creation failed",
        userErrors: draftOrderData.userErrors
      }, { status: 400 });
    }

    if (!draftOrderData.draftOrder) {
      return json({ error: "Failed to create draft order" }, { status: 400 });
    }

    console.log('✅ Draft order created successfully:', draftOrderData.draftOrder.id);

    return json({
      draftOrder: {
        id: draftOrderData.draftOrder.id,
        name: draftOrderData.draftOrder.name,
        checkoutUrl: draftOrderData.draftOrder.invoiceUrl, // Use invoiceUrl for customer checkout
        invoiceUrl: draftOrderData.draftOrder.invoiceUrl, // For sending invoices
        totalPrice: draftOrderData.draftOrder.totalPrice,
        lineItems: draftOrderData.draftOrder.lineItems.edges.map((edge: any) => edge.node)
      }
    });

  } catch (error) {
    console.error('💥 Error creating draft order:', error);

    return json({
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 });
  }
}