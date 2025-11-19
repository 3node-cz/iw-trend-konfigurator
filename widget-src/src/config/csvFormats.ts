/**
 * CSV Export Format Configurations
 *
 * Defines 3 different CSV export formats for cutting orders
 */

export type CSVColumnMapping = {
  field: string;
  getValue: (row: any) => string | number;
};

export type CSVFormat = {
  name: string;
  delimiter: string;
  hasHeader: boolean;
  headerRows?: string[][]; // For formats with custom headers (like order number)
  columnHeaders?: string[]; // For formats with column name headers
  columns: CSVColumnMapping[];
};

/**
 * Format 1: MENS
 * No header, semicolon delimited
 * Columns: ?,partName,length,width,quantity,?,empty,?,?,materialType,?,block,materialName,empty,orderPrefix
 */
export const CSV_FORMAT_MENS: CSVFormat = {
  name: 'MENS',
  delimiter: ';',
  hasHeader: false,
  columns: [
    {
      field: 'index',
      getValue: () => '1', // Always 1 in examples
    },
    {
      field: 'partName',
      getValue: (row) => row.partName || '',
    },
    {
      field: 'length',
      getValue: (row) => row.length || 0,
    },
    {
      field: 'width',
      getValue: (row) => row.width || 0,
    },
    {
      field: 'quantity',
      getValue: (row) => row.quantity || 0,
    },
    {
      field: 'unknown1',
      getValue: () => '1', // Always 1 in examples
    },
    {
      field: 'empty1',
      getValue: () => '',
    },
    {
      field: 'unknown2',
      getValue: () => '1', // Always 1 in examples
    },
    {
      field: 'unknown3',
      getValue: () => '1', // Always 1 in examples
    },
    {
      field: 'materialType',
      getValue: (row) => `"${row.materialType || 'DTD Laminovana18'}"`,
    },
    {
      field: 'unknown4',
      getValue: () => '0', // Always 0 in examples
    },
    {
      field: 'block',
      getValue: (row) => row.block || '2_z_2',
    },
    {
      field: 'materialName',
      getValue: (row) => row.materialName || '',
    },
    {
      field: 'empty2',
      getValue: () => '',
    },
    {
      field: 'orderPrefix',
      getValue: (row) => row.orderName || '',
    },
  ],
};

/**
 * Format 2: Standard
 * Has order header, semicolon delimited
 * Header: "Objednavka c. {orderNumber};;;;;;;;;"
 * Columns: partName,materialName,length,width,quantity,?,empty,?,?,block,empty,empty,type,materialType,?
 */
export const CSV_FORMAT_STANDARD: CSVFormat = {
  name: 'Standard',
  delimiter: ';',
  hasHeader: true,
  headerRows: [
    ['Objednavka c. {orderNumber}', '', '', '', '', '', '', '', '', ''], // Will be filled with order number
  ],
  columns: [
    {
      field: 'partName',
      getValue: (row) => row.partName || '',
    },
    {
      field: 'materialName',
      getValue: (row) => row.materialName || '',
    },
    {
      field: 'length',
      getValue: (row) => row.length || 0,
    },
    {
      field: 'width',
      getValue: (row) => row.width || 0,
    },
    {
      field: 'quantity',
      getValue: (row) => row.quantity || 0,
    },
    {
      field: 'unknown1',
      getValue: () => '1',
    },
    {
      field: 'empty1',
      getValue: () => '',
    },
    {
      field: 'unknown2',
      getValue: () => '1',
    },
    {
      field: 'unknown3',
      getValue: () => '1',
    },
    {
      field: 'block',
      getValue: (row) => row.block || '2_z_2',
    },
    {
      field: 'empty2',
      getValue: () => '',
    },
    {
      field: 'empty3',
      getValue: () => '',
    },
    {
      field: 'type',
      getValue: () => 'štandardný',
    },
    {
      field: 'materialType',
      getValue: (row) => `"${row.materialType || 'DTD Laminovana18'}"`,
    },
    {
      field: 'unknown4',
      getValue: () => '0',
    },
  ],
};

/**
 * Format 3: BICORN
 * Has column header row, semicolon delimited
 * Headers: ks;dlzka;sirka;nazov;poznamka;duplak;orientacia;blok;hrana1;hrana2;hrana3;hrana4;vlys_complet;vlys_svg
 */
export const CSV_FORMAT_BICORN: CSVFormat = {
  name: 'BICORN',
  delimiter: ';',
  hasHeader: true,
  columnHeaders: [
    'ks',
    'dlzka',
    'sirka',
    'nazov',
    'poznamka',
    'duplak',
    'orientacia',
    'blok',
    'hrana1',
    'hrana2',
    'hrana3',
    'hrana4',
    'vlys_complet',
    'vlys_svg',
  ],
  columns: [
    {
      field: 'ks',
      getValue: (row) => row.quantity || 0,
    },
    {
      field: 'dlzka',
      getValue: (row) => row.length || 0,
    },
    {
      field: 'sirka',
      getValue: (row) => row.width || 0,
    },
    {
      field: 'nazov',
      getValue: (row) => row.partName || '',
    },
    {
      field: 'poznamka',
      getValue: (row) => row.notes || '',
    },
    {
      field: 'duplak',
      getValue: (row) => row.isDupel ? '1' : '0',
    },
    {
      field: 'orientacia',
      getValue: (row) => row.allowRotation ? '3' : '0', // 3 seems to mean rotation allowed
    },
    {
      field: 'blok',
      getValue: (row) => row.algorithmValue || '0',
    },
    {
      field: 'hrana1',
      getValue: (row) => row.edgeTop ? '1' : '0',
    },
    {
      field: 'hrana2',
      getValue: (row) => row.edgeBottom ? '1' : '0',
    },
    {
      field: 'hrana3',
      getValue: (row) => row.edgeLeft ? '1' : '0',
    },
    {
      field: 'hrana4',
      getValue: (row) => row.edgeRight ? '1' : '0',
    },
    {
      field: 'vlys_complet',
      getValue: () => '0',
    },
    {
      field: 'vlys_svg',
      getValue: () => '',
    },
  ],
};

/**
 * All available CSV formats
 */
export const CSV_FORMATS = {
  MENS: CSV_FORMAT_MENS,
  STANDARD: CSV_FORMAT_STANDARD,
  BICORN: CSV_FORMAT_BICORN,
} as const;

export type CSVFormatType = keyof typeof CSV_FORMATS;
