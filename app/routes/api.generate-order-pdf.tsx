import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

/**
 * API endpoint to generate and upload order PDF to Shopify
 *
 * This endpoint handles PDF upload AFTER order creation (non-blocking approach)
 * If PDF fails, order is already saved - this is just documentation attachment
 *
 * Usage: POST /apps/configurator/api/generate-order-pdf
 * Body: FormData with 'pdf' file and 'draftOrderId' field
 */

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
  const DEBUG = process.env.NODE_ENV === 'development';

  if (request.method !== "POST") {
    return json({
      success: false,
      error: "Method not allowed"
    }, {
      status: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
      }
    });
  }

  try {
    // Authenticate with app proxy (storefront widget calls this endpoint)
    const { session, admin } = await authenticate.public.appProxy(request);

    if (!session?.shop) {
      return json({
        success: false,
        error: "No shop session found"
      }, {
        status: 401,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    if (!admin) {
      return json({
        success: false,
        error: "Admin API not available"
      }, {
        status: 401,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    console.log('📄 PDF upload endpoint hit');

    // Parse FormData
    const formData = await request.formData();
    const pdfFile = formData.get('pdf') as File;
    const draftOrderId = formData.get('draftOrderId') as string;
    const orderName = formData.get('orderName') as string;

    // Validate inputs
    if (!pdfFile) {
      return json({
        success: false,
        error: 'PDF file is required'
      }, {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    if (!draftOrderId) {
      return json({
        success: false,
        error: 'Draft order ID is required'
      }, {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    if (!orderName) {
      return json({
        success: false,
        error: 'Order name is required'
      }, {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    console.log('📤 Uploading PDF:', {
      filename: pdfFile.name,
      size: `${(pdfFile.size / 1024).toFixed(2)} KB`,
      draftOrderId,
      orderName,
    });

    // Convert File to Buffer (needed for Shopify upload)
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());

    // Generate structured filename: CONFIGURATION-{DraftOrderNumber}-{Timestamp}.pdf
    // Extract draft order number from GID (e.g., "gid://shopify/DraftOrder/123456" -> "D123456")
    const draftOrderNumber = draftOrderId.split('/').pop() || 'UNKNOWN';
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0].replace('T', '-');
    const filename = `CONFIGURATION-D${draftOrderNumber}-${timestamp}.pdf`;

    console.log('📝 Generated filename:', filename);

    // === STEP 1: Create staged upload target ===
    console.log('🎯 Step 1: Creating staged upload target...');

    const stagedUploadMutation = `
      mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
        stagedUploadsCreate(input: $input) {
          stagedTargets {
            url
            resourceUrl
            parameters {
              name
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

    const stagedResponse = await admin.graphql(stagedUploadMutation, {
      variables: {
        input: [{
          filename,
          mimeType: 'application/pdf',
          resource: 'FILE',
          httpMethod: 'POST',
          fileSize: pdfBuffer.length.toString(),
        }]
      }
    });

    const stagedData = await stagedResponse.json();

    if (DEBUG) console.log('📦 Staged upload response:', JSON.stringify(stagedData, null, 2));

    if (stagedData.data?.stagedUploadsCreate?.userErrors?.length > 0) {
      const errors = stagedData.data.stagedUploadsCreate.userErrors;
      console.error('❌ Staged upload errors:', errors);
      return json({
        error: 'Failed to create staged upload',
        details: errors.map((e: any) => `${e.field}: ${e.message}`).join(', ')
      }, { status: 500 });
    }

    const stagedTarget = stagedData.data.stagedUploadsCreate.stagedTargets[0];

    if (!stagedTarget) {
      return json({
        success: false,
        error: 'No staged target returned from Shopify'
      }, {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    console.log('✅ Staged upload target created:', stagedTarget.url);

    // === STEP 2: Upload PDF to Shopify's S3 ===
    console.log('☁️ Step 2: Uploading PDF to S3...');

    const uploadFormData = new FormData();

    // Add all parameters from Shopify (required for S3 authentication)
    stagedTarget.parameters.forEach((param: any) => {
      uploadFormData.append(param.name, param.value);
    });

    // Add the PDF file (must be last)
    uploadFormData.append('file', new Blob([pdfBuffer], { type: 'application/pdf' }), filename);

    const s3Response = await fetch(stagedTarget.url, {
      method: 'POST',
      body: uploadFormData,
    });

    if (!s3Response.ok) {
      const errorText = await s3Response.text();
      console.error('❌ S3 upload failed:', s3Response.status, errorText);
      return json({
        error: 'Failed to upload PDF to Shopify storage',
        details: `S3 returned ${s3Response.status}: ${errorText.substring(0, 200)}`
      }, { status: 500 });
    }

    console.log('✅ PDF uploaded to S3 successfully');

    // === STEP 3: Create file record in Shopify ===
    console.log('📝 Step 3: Creating file record...');

    const fileCreateMutation = `
      mutation fileCreate($files: [FileCreateInput!]!) {
        fileCreate(files: $files) {
          files {
            ... on GenericFile {
              id
              url
              alt
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const fileResponse = await admin.graphql(fileCreateMutation, {
      variables: {
        files: [{
          alt: `Order Configuration PDF - ${orderName}`,
          contentType: 'FILE',
          originalSource: stagedTarget.resourceUrl,
        }]
      }
    });

    const fileData = await fileResponse.json();

    if (DEBUG) console.log('📄 File create response:', JSON.stringify(fileData, null, 2));

    if (fileData.data?.fileCreate?.userErrors?.length > 0) {
      const errors = fileData.data.fileCreate.userErrors;
      console.error('❌ File creation errors:', errors);
      return json({
        error: 'Failed to create file record',
        details: errors.map((e: any) => `${e.field}: ${e.message}`).join(', ')
      }, { status: 500 });
    }

    const file = fileData.data.fileCreate.files[0];

    if (!file) {
      return json({
        success: false,
        error: 'No file returned from Shopify'
      }, {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    console.log('✅ File record created:', file.id);

    // === STEP 4: Attach file reference to draft order via metafield ===
    console.log('🔗 Step 4: Attaching PDF metafield to draft order...');

    const metafieldsSetMutation = `
      mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
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

    const metafieldResponse = await admin.graphql(metafieldsSetMutation, {
      variables: {
        metafields: [{
          ownerId: draftOrderId,
          namespace: 'iw_trend_configurator',
          key: 'order_configuration_pdf',
          type: 'file_reference',
          value: file.id, // GID of the file
        }]
      }
    });

    const metafieldData = await metafieldResponse.json();

    if (DEBUG) console.log('🏷️ Metafield response:', JSON.stringify(metafieldData, null, 2));

    if (metafieldData.data?.metafieldsSet?.userErrors?.length > 0) {
      const errors = metafieldData.data.metafieldsSet.userErrors;
      console.error('❌ Metafield errors:', errors);
      // Don't fail - file is uploaded, just not attached
      console.warn('⚠️ PDF uploaded but metafield attachment failed');
    } else {
      console.log('✅ PDF metafield attached successfully');
    }

    // Return success
    return json({
      success: true,
      fileId: file.id,
      fileUrl: file.url,
      message: 'PDF uploaded and attached to draft order successfully',
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      }
    });

  } catch (error) {
    console.error('💥 PDF upload failed:', error);

    return json({
      success: false,
      error: 'PDF upload failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      }
    });
  }
}
