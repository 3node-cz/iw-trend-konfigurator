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

    if (!admin) {
      console.error('❌ Admin API not available');
      return new Response('Admin API not available', { status: 500 });
    }

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

    // STEP 4: Read both configuration and PDF metafields from the draft order
    const getDraftOrderMetafieldQuery = `
      query getDraftOrderMetafield($id: ID!) {
        draftOrder(id: $id) {
          id
          configMetafield: metafield(namespace: "custom", key: "order_configuration") {
            id
            namespace
            key
            value
            type
          }
          pdfMetafield: metafield(namespace: "iw_trend_configurator", key: "order_configuration_pdf") {
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
    const configMetafield = draftOrderData.data?.draftOrder?.configMetafield;
    const pdfMetafield = draftOrderData.data?.draftOrder?.pdfMetafield;

    if (!configMetafield && !pdfMetafield) {
      console.log('⚠️ No metafields found on draft order');
      return new Response('OK - No metafields to copy', { status: 200 });
    }

    console.log('✅ Found metafields on draft order:', {
      configMetafield: configMetafield ? { namespace: configMetafield.namespace, key: configMetafield.key } : null,
      pdfMetafield: pdfMetafield ? { namespace: pdfMetafield.namespace, key: pdfMetafield.key } : null,
    });

    // STEP 5: Copy both metafields to the new order
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

    console.log('📝 Copying metafields to order...');

    // Build array of metafields to copy
    const metafieldsToSet = [];

    if (configMetafield) {
      metafieldsToSet.push({
        ownerId: orderGid,
        namespace: configMetafield.namespace,
        key: configMetafield.key,
        type: configMetafield.type,
        value: configMetafield.value,
      });
      console.log('  ✓ Will copy order_configuration metafield');
    }

    if (pdfMetafield) {
      metafieldsToSet.push({
        ownerId: orderGid,
        namespace: pdfMetafield.namespace,
        key: pdfMetafield.key,
        type: pdfMetafield.type,
        value: pdfMetafield.value,
      });
      console.log('  ✓ Will copy configuration_pdf metafield');
    }

    const setMetafieldResponse = await admin.graphql(setOrderMetafieldMutation, {
      variables: {
        metafields: metafieldsToSet,
      },
    });

    const setMetafieldResult = await setMetafieldResponse.json();

    // STEP 6: Check for errors
    if (setMetafieldResult.data?.metafieldsSet?.userErrors?.length > 0) {
      console.error('❌ Error copying metafields:', setMetafieldResult.data.metafieldsSet.userErrors);
      return new Response('Error copying metafields', { status: 500 });
    }

    const copiedMetafields = setMetafieldResult.data?.metafieldsSet?.metafields || [];
    console.log(`✅ Successfully copied ${copiedMetafields.length} metafield(s) to order!`);
    copiedMetafields.forEach((mf: any) => {
      console.log(`  📦 ${mf.namespace}.${mf.key}: ${mf.id}`);
    });

    // STEP 7: Return success response to Shopify
    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('💥 Error in draft order complete webhook:', error);

    // Return 200 even on error to prevent Shopify from retrying
    // (since retrying won't help if there's a code issue)
    return new Response('Error processed', { status: 200 });
  }
};
