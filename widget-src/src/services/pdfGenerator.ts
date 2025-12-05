/**
 * PDF Generation Service using jsPDF and html2canvas
 * Generates high-quality PDF from HTML order recapitulation
 */
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFGenerationOptions {
  filename?: string;
  scale?: number; // Higher = better quality (default: 2)
  compression?: 'NONE' | 'FAST' | 'SLOW'; // PDF compression
}

/**
 * Generate PDF from HTML element
 * @param elementId ID of element to convert (without #)
 * @param options PDF generation options
 * @returns PDF as Blob
 */
export async function generatePDFFromElement(
  elementId: string,
  options: PDFGenerationOptions = {}
): Promise<Blob> {
  const {
    scale = 2,
    compression = 'FAST',
    filename = 'order-configuration.pdf'
  } = options;

  console.log('📄 Starting PDF generation for element:', elementId);

  // Get the element
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with ID "${elementId}" not found`);
  }

  // Temporarily show print-only elements for PDF
  const printOnlyElements = element.querySelectorAll('.print-only');
  const originalPrintOnlyDisplay: string[] = [];
  printOnlyElements.forEach((el, index) => {
    originalPrintOnlyDisplay[index] = (el as HTMLElement).style.display;
    (el as HTMLElement).style.display = 'block';
  });

  // Temporarily hide no-print elements
  const noPrintElements = element.querySelectorAll('.no-print');
  const originalNoPrintDisplay: string[] = [];
  noPrintElements.forEach((el, index) => {
    originalNoPrintDisplay[index] = (el as HTMLElement).style.display;
    (el as HTMLElement).style.display = 'none';
  });

  try {
    console.log('📸 Capturing HTML as canvas...');

    // Capture HTML as canvas
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        // Additional cleanup in cloned document if needed
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // Remove any interactive elements from clone
          const buttons = clonedElement.querySelectorAll('button');
          buttons.forEach(btn => btn.style.display = 'none');
        }
      }
    });

    console.log('✅ Canvas generated:', canvas.width, 'x', canvas.height, 'pixels');

    // A4 dimensions in mm
    const a4Width = 210;
    const a4Height = 297;

    // Calculate dimensions to fit canvas on A4
    const imgData = canvas.toDataURL('image/png', 1.0);
    const imgWidth = a4Width;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    console.log('📄 Creating PDF document...');

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: compression !== 'NONE',
    });

    let heightLeft = imgHeight;
    let position = 0;
    let pageNumber = 1;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= a4Height;

    // Add additional pages if content overflows
    while (heightLeft > 0) {
      pageNumber++;
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= a4Height;
    }

    console.log(`✅ PDF generated successfully (${pageNumber} page${pageNumber > 1 ? 's' : ''})`);

    // Return as Blob
    const blob = pdf.output('blob');
    console.log('📦 PDF blob size:', (blob.size / 1024).toFixed(2), 'KB');

    return blob;

  } catch (error) {
    console.error('❌ PDF generation failed:', error);
    throw error;
  } finally {
    // Restore visibility of print-only elements
    printOnlyElements.forEach((el, index) => {
      (el as HTMLElement).style.display = originalPrintOnlyDisplay[index];
    });

    // Restore visibility of no-print elements
    noPrintElements.forEach((el, index) => {
      (el as HTMLElement).style.display = originalNoPrintDisplay[index];
    });

    console.log('🔄 Restored original element visibility');
  }
}

/**
 * Generate PDF from HTML element directly (no DOM query)
 * @param element The HTML element to convert
 * @param options PDF generation options
 * @returns PDF as Blob
 */
export async function generatePDFFromElementDirect(
  element: HTMLElement,
  options: PDFGenerationOptions = {}
): Promise<Blob> {
  const {
    scale = 2,
    compression = 'FAST',
    filename = 'order-configuration.pdf'
  } = options;

  console.log('📄 Starting PDF generation from element:', element.id || 'unnamed');

  // Temporarily show print-only elements for PDF
  const printOnlyElements = element.querySelectorAll('.print-only');
  const originalPrintOnlyDisplay: string[] = [];
  printOnlyElements.forEach((el, index) => {
    originalPrintOnlyDisplay[index] = (el as HTMLElement).style.display;
    (el as HTMLElement).style.display = 'block';
  });

  // Temporarily hide no-print elements
  const noPrintElements = element.querySelectorAll('.no-print');
  const originalNoPrintDisplay: string[] = [];
  noPrintElements.forEach((el, index) => {
    originalNoPrintDisplay[index] = (el as HTMLElement).style.display;
    (el as HTMLElement).style.display = 'none';
  });

  try {
    // DEBUG: Log element state before capture
    console.log('📸 Pre-capture element state:', {
      id: element.id,
      tagName: element.tagName,
      width: element.offsetWidth,
      height: element.offsetHeight,
      scrollWidth: element.scrollWidth,
      scrollHeight: element.scrollHeight,
      childCount: element.children.length,
      hasContent: element.textContent && element.textContent.length > 0,
      computedDisplay: window.getComputedStyle(element).display,
      computedVisibility: window.getComputedStyle(element).visibility,
    });

    console.log('📸 Capturing HTML as canvas...');

    // Capture HTML as canvas
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: false,
      logging: true, // Enable logging for debugging
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        // Additional cleanup in cloned document if needed
        const clonedElement = clonedDoc.getElementById(element.id);
        if (clonedElement) {
          console.log('🔍 Cloned element state:', {
            width: clonedElement.offsetWidth,
            height: clonedElement.offsetHeight,
            childCount: clonedElement.children.length,
          });
          // Remove any interactive elements from clone
          const buttons = clonedElement.querySelectorAll('button');
          buttons.forEach(btn => btn.style.display = 'none');
        }
      }
    });

    console.log('✅ Canvas generated:', canvas.width, 'x', canvas.height, 'pixels');

    // DEBUG: Check if canvas has content
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const hasNonWhitePixels = imageData.data.some((value, index) => {
        // Check RGB values (skip alpha channel)
        if (index % 4 === 3) return false;
        return value !== 255; // Not white
      });
      console.log('🎨 Canvas has non-white content:', hasNonWhitePixels);
    }

    // A4 dimensions in mm
    const a4Width = 210;
    const a4Height = 297;

    // Calculate dimensions to fit canvas on A4
    const imgData = canvas.toDataURL('image/png', 1.0);
    const imgWidth = a4Width;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    console.log('📄 Creating PDF document...');

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: compression !== 'NONE',
    });

    let heightLeft = imgHeight;
    let position = 0;
    let pageNumber = 1;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= a4Height;

    // Add additional pages if content overflows
    while (heightLeft > 0) {
      pageNumber++;
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= a4Height;
    }

    console.log(`✅ PDF generated successfully (${pageNumber} page${pageNumber > 1 ? 's' : ''})`);

    // Return as Blob
    const blob = pdf.output('blob');
    console.log('📦 PDF blob size:', (blob.size / 1024).toFixed(2), 'KB');

    return blob;

  } catch (error) {
    console.error('❌ PDF generation failed:', error);
    throw error;
  } finally {
    // Restore visibility of print-only elements
    printOnlyElements.forEach((el, index) => {
      (el as HTMLElement).style.display = originalPrintOnlyDisplay[index];
    });

    // Restore visibility of no-print elements
    noPrintElements.forEach((el, index) => {
      (el as HTMLElement).style.display = originalNoPrintDisplay[index];
    });

    console.log('🔄 Restored original element visibility');
  }
}

/**
 * Generate PDF for order configuration
 * Convenience function with preset options for order recapitulation
 * @param orderName Order name for filename
 * @param element Optional: HTML element to convert (if not provided, uses DOM query)
 * @returns PDF Blob
 */
export async function generateOrderPDF(orderName: string, element?: HTMLElement): Promise<Blob> {
  console.log('📋 Generating order PDF for:', orderName);

  if (element) {
    // Use provided element directly (v5 - useRef approach)
    return generatePDFFromElementDirect(element, {
      filename: `${orderName}-configuration.pdf`,
      scale: 2,
      compression: 'FAST',
    });
  } else {
    // Fallback to DOM query (legacy approach)
    const elementId = 'order-recapitulation-container';
    return generatePDFFromElement(elementId, {
      filename: `${orderName}-configuration.pdf`,
      scale: 2,
      compression: 'FAST',
    });
  }
}

/**
 * Download PDF file directly in browser (for testing)
 * @param blob PDF Blob to download
 * @param filename Filename for download
 */
export function downloadPDFBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  console.log('💾 PDF download triggered:', link.download);
}
