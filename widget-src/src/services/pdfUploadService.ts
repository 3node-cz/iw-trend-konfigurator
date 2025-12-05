/**
 * PDF Upload Service
 * Handles uploading generated PDFs to Shopify via backend API
 */

export interface PDFUploadOptions {
  draftOrderId: string;
  orderName: string;
  pdfBlob: Blob;
}

export interface PDFUploadResult {
  success: boolean;
  fileId?: string;
  fileUrl?: string;
  message?: string;
  error?: string;
  details?: string;
}

/**
 * Upload PDF to Shopify and attach to draft order
 * This is called AFTER order creation succeeds (non-blocking)
 *
 * @param options PDF upload configuration
 * @returns Upload result with file URL
 */
export async function uploadOrderPDF(
  options: PDFUploadOptions
): Promise<PDFUploadResult> {
  const { draftOrderId, orderName, pdfBlob } = options;

  console.log('📤 Starting PDF upload to Shopify...', {
    draftOrderId,
    orderName,
    size: `${(pdfBlob.size / 1024).toFixed(2)} KB`,
  });

  try {
    // Generate structured filename: CONFIGURATION-{DraftOrderNumber}-{Timestamp}.pdf
    // Extract draft order number from GID (e.g., "gid://shopify/DraftOrder/123456" -> "D123456")
    const draftOrderNumber = draftOrderId.split('/').pop() || 'UNKNOWN';
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0].replace('T', '-');
    const filename = `CONFIGURATION-D${draftOrderNumber}-${timestamp}.pdf`;

    console.log('📝 Upload filename:', filename);

    // Prepare FormData
    const formData = new FormData();
    formData.append('pdf', pdfBlob, filename);
    formData.append('draftOrderId', draftOrderId);
    formData.append('orderName', orderName);

    // Call backend API
    const response = await fetch('/apps/configurator/api/generate-order-pdf', {
      method: 'POST',
      body: formData,
      // Don't set Content-Type - browser will set it with boundary for FormData
    });

    const result: PDFUploadResult = await response.json();

    if (!response.ok) {
      console.error('❌ PDF upload failed:', result);
      return {
        success: false,
        error: result.error || 'Upload failed',
        details: result.details || `Server returned ${response.status}`,
      };
    }

    console.log('✅ PDF uploaded successfully:', result);

    return result;

  } catch (error) {
    console.error('❌ PDF upload error:', error);

    return {
      success: false,
      error: 'Network error',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate and upload PDF for an order
 * Combines PDF generation + upload in one call
 *
 * @param draftOrderId Draft order GID
 * @param orderName Order name for filename
 * @param generatePDF Function to generate PDF blob
 * @returns Upload result
 */
export async function generateAndUploadOrderPDF(
  draftOrderId: string,
  orderName: string,
  generatePDF: () => Promise<Blob>
): Promise<PDFUploadResult> {
  try {
    console.log('📄 Generating PDF...');

    // Generate PDF
    const pdfBlob = await generatePDF();

    console.log(`✅ PDF generated (${(pdfBlob.size / 1024).toFixed(2)} KB)`);

    // Upload to Shopify
    return await uploadOrderPDF({
      draftOrderId,
      orderName,
      pdfBlob,
    });

  } catch (error) {
    console.error('❌ PDF generation failed:', error);

    return {
      success: false,
      error: 'PDF generation failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
