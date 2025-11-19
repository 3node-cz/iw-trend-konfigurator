import type { CompleteOrder } from '../types/shopify';
import { CSV_FORMATS, type CSVFormat, type CSVFormatType } from '../config/csvFormats';

/**
 * CSV Export Service
 * Generates CSV files from order configuration data in different formats
 */

interface CSVRow {
  partName: string;
  length: number;
  width: number;
  quantity: number;
  notes?: string;
  isDupel?: boolean;
  allowRotation?: boolean;
  algorithmValue?: number;
  edgeTop: number | null;
  edgeBottom: number | null;
  edgeLeft: number | null;
  edgeRight: number | null;
  materialName: string;
  materialType: string;
  block: string;
  orderName: string;
}

/**
 * Converts order configuration to CSV row data
 */
function orderToCsvRows(order: CompleteOrder): CSVRow[] {
  const rows: CSVRow[] = [];

  for (const spec of order.specifications) {
    // Skip specifications without pieces
    if (!spec.pieces || spec.pieces.length === 0) continue;

    const materialName = spec.material.title || spec.material.name || '';
    const materialType = 'DTD Laminovana18'; // Default material type

    for (const piece of spec.pieces) {
      // Determine block identifier
      const block = piece.algorithmValue ? `${piece.algorithmValue}_z_${spec.pieces.length}` : '0_z_1';

      rows.push({
        partName: piece.partName || '',
        length: piece.length || 0,
        width: piece.width || 0,
        quantity: piece.quantity || 1,
        notes: piece.notes,
        isDupel: piece.isDupel,
        allowRotation: piece.allowRotation,
        algorithmValue: piece.algorithmValue || 0,
        edgeTop: piece.edgeTop,
        edgeBottom: piece.edgeBottom,
        edgeLeft: piece.edgeLeft,
        edgeRight: piece.edgeRight,
        materialName,
        materialType,
        block,
        orderName: order.order.orderName || '',
      });
    }
  }

  return rows;
}

/**
 * Generates CSV content from rows using the specified format
 */
function generateCsvContent(rows: CSVRow[], format: CSVFormat, orderNumber?: string): string {
  const lines: string[] = [];

  // Add custom header rows if present (like "Objednavka c. 97/2025")
  if (format.headerRows) {
    for (const headerRow of format.headerRows) {
      const processedRow = headerRow.map(cell =>
        cell.replace('{orderNumber}', orderNumber || '')
      );
      lines.push(processedRow.join(format.delimiter));
    }
  }

  // Add column header row if present
  if (format.columnHeaders) {
    lines.push(format.columnHeaders.join(format.delimiter));
  }

  // Add data rows
  for (const row of rows) {
    const values = format.columns.map(col => col.getValue(row));
    lines.push(values.join(format.delimiter));
  }

  return lines.join('\n');
}

/**
 * Downloads CSV file with the given content
 */
function downloadCsv(content: string, filename: string) {
  // Create blob with UTF-8 BOM for proper Excel encoding
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  // Create temporary link and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports order configuration as CSV in the specified format
 */
export function exportOrderToCsv(
  order: CompleteOrder,
  formatType: CSVFormatType,
  customFilename?: string
): void {
  const format = CSV_FORMATS[formatType];
  const rows = orderToCsvRows(order);

  // Generate CSV content
  const content = generateCsvContent(rows, format, order.order.orderName);

  // Generate filename
  const timestamp = new Date().toISOString().split('T')[0];
  const orderName = order.order.orderName || 'order';
  const filename = customFilename || `${orderName}-${timestamp}-${format.name}.csv`;

  // Download file
  downloadCsv(content, filename);

  console.log(`✅ Exported ${rows.length} rows to ${filename} in ${format.name} format`);
}

/**
 * Export all 3 formats at once
 */
export function exportOrderToAllFormats(order: CompleteOrder): void {
  const timestamp = new Date().toISOString().split('T')[0];
  const orderName = order.order.orderName || 'order';

  Object.keys(CSV_FORMATS).forEach((formatKey) => {
    const formatType = formatKey as CSVFormatType;
    const filename = `${orderName}-${timestamp}-${formatType}.csv`;
    exportOrderToCsv(order, formatType, filename);
  });

  console.log('✅ Exported order to all CSV formats');
}
