import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

/**
 * STEP 1: This webhook is triggered when a draft order is completed (paid)
 * Shopify automatically registers this webhook based on the file name
 * File name format: webhooks.{TOPIC}.tsx -> webhooks.draft_orders.complete.tsx
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  console.log('🎯 Draft order complete webhook received');

  try {
    // STEP 2: Authenticate the webhook request
    // This ensures the request actually came from Shopify
    const { topic, shop, session, admin, payload } = await authenticate.webhook(request);

    console.log(`📦 Webhook topic: ${topic}`);
    console.log(`🏪 Shop: ${shop}`);
    console.log(`📄 Draft Order ID: ${payload.id}`);

    // STEP 3: Get the completed order ID from the payload
    // When a draft order completes, Shopify includes the new order ID
    const orderId = payload.order_id;
    const draftOrderId = `gid://shopify/DraftOrder/${payload.id}`;
    const orderGid = `gid://shopify/Order/${orderId}`;

    console.log(`🔄 Draft Order: ${draftOrderId}`);
    console.log(`✅ New Order: ${orderGid}`);

    if (!orderId) {
      console.log('⚠️ No order ID found in payload - draft order may not have converted to order yet');
      return new Response('OK - No order created yet', { status: 200 });
    }

    // STEP 4: Read the configuration metafield from the draft order
    const getDraftOrderMetafieldQuery = `
      query getDraftOrderMetafield($id: ID!) {
        draftOrder(id: $id) {
          id
          metafield(namespace: "custom", key: "order_configuration") {
            id
            namespace
            key
            value
            type
          }
        }
      }
    `;

    console.log('📖 Reading metafield from draft order...');

    const draftOrderResponse = await admin.graphql(getDraftOrderMetafieldQuery, {
      variables: {
        id: draftOrderId,
      },
    });

    const draftOrderData = await draftOrderResponse.json();
    const metafield = draftOrderData.data?.draftOrder?.metafield;

    if (!metafield) {
      console.log('⚠️ No configuration metafield found on draft order');
      return new Response('OK - No metafield to copy', { status: 200 });
    }

    console.log('✅ Found metafield on draft order:', {
      namespace: metafield.namespace,
      key: metafield.key,
      hasValue: !!metafield.value,
    });

    // STEP 5: Copy the metafield to the new order
    const setOrderMetafieldMutation = `
      mutation setOrderMetafield($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
            value
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    console.log('📝 Copying metafield to order...');

    const setMetafieldResponse = await admin.graphql(setOrderMetafieldMutation, {
      variables: {
        metafields: [
          {
            ownerId: orderGid,
            namespace: metafield.namespace,
            key: metafield.key,
            type: metafield.type,
            value: metafield.value,
          },
        ],
      },
    });

    const setMetafieldResult = await setMetafieldResponse.json();

    // STEP 6: Check for errors
    if (setMetafieldResult.data?.metafieldsSet?.userErrors?.length > 0) {
      console.error('❌ Error copying metafield:', setMetafieldResult.data.metafieldsSet.userErrors);
      return new Response('Error copying metafield', { status: 500 });
    }

    console.log('✅ Successfully copied configuration metafield to order!');
    console.log('📦 Order metafield ID:', setMetafieldResult.data?.metafieldsSet?.metafields?.[0]?.id);

    // STEP 7: Return success response to Shopify
    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('💥 Error in draft order complete webhook:', error);

    // Return 200 even on error to prevent Shopify from retrying
    // (since retrying won't help if there's a code issue)
    return new Response('Error processed', { status: 200 });
  }
};
