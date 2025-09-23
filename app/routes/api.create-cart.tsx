import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

export async function action({ request }: ActionFunctionArgs) {
  console.log('🛒 Create cart endpoint hit');

  try {
    // Authenticate with app proxy
    const { session, admin } = await authenticate.public.appProxy(request);

    if (!session?.shop) {
      return json({ error: "No shop session found" }, { status: 401 });
    }

    if (!admin) {
      return json({ error: "Admin API not available" }, { status: 401 });
    }

    // Parse request body for cart items
    const body = await request.json();
    const { items = [] } = body;

    console.log('🛒 Creating cart with items:', items);

    // GraphQL mutation to create a draft order using Admin API
    const draftOrderCreateMutation = `
      mutation draftOrderCreate($input: DraftOrderInput!) {
        draftOrderCreate(input: $input) {
          draftOrder {
            id
            name
            webUrl
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
                    sku
                  }
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

    // Parse orderAttributes if provided
    const { orderAttributes } = body;

    // Transform items to draft order line items format
    const lineItems = items.map((item: any) => ({
      variantId: item.variantId,
      quantity: item.quantity || 1,
      // Add custom attributes if needed
      customAttributes: item.attributes || []
    }));

    const variables = {
      input: {
        lineItems,
        // Add custom attributes to the order
        customAttributes: orderAttributes ? Object.entries(orderAttributes).map(([key, value]) => ({
          key,
          value: String(value)
        })) : [],
        // Add tags for tracking
        tags: ["cutting-configurator", "auto-generated"]
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
        checkoutUrl: draftOrderData.draftOrder.webUrl, // Use webUrl as checkoutUrl
        webUrl: draftOrderData.draftOrder.webUrl,
        invoiceUrl: draftOrderData.draftOrder.invoiceUrl,
        totalPrice: draftOrderData.draftOrder.totalPrice,
        lineItems: draftOrderData.draftOrder.lineItems.edges.map((edge: any) => edge.node)
      }
    });

  } catch (error) {
    console.error('💥 Error creating cart:', error);

    return json({
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 });
  }
}