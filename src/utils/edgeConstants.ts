/**
 * Constants and configurations for edge treatments and corner modifications
 */

export type EdgeValue = 'none' | 'abs-1mm' | 'abs-2mm';

export interface EdgeOption {
  value: EdgeValue;
  label: string;
}

/**
 * Available edge treatment options
 */
export const EDGE_OPTIONS: EdgeOption[] = [
  { value: 'none', label: 'Bez hrany' },
  { value: 'abs-1mm', label: 'ABS 1mm' },
  { value: 'abs-2mm', label: 'ABS 2mm' }
];

/**
 * Edge labels for UI
 */
export const EDGE_LABELS = {
  top: 'Horná hrana',
  right: 'Pravá hrana',
  bottom: 'Dolná hrana',
  left: 'Ľavá hrana'
} as const;

/**
 * Corner type options
 */
export const CORNER_TYPE_OPTIONS = [
  { value: 'none', label: 'Bez úpravy' },
  { value: 'bevel', label: 'Zokosenie' },
  { value: 'round', label: 'Zaoblenie' }
] as const;

/**
 * Default edge configuration
 */
export const DEFAULT_EDGES = {
  top: 'none' as EdgeValue,
  right: 'none' as EdgeValue,
  bottom: 'none' as EdgeValue,
  left: 'none' as EdgeValue
};

/**
 * Corner positions in clockwise order
 */
export const CORNER_POSITIONS = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'] as const;

export type CornerPosition = typeof CORNER_POSITIONS[number];

/**
 * Corner labels for UI
 */
export const CORNER_LABELS = {
  topLeft: 'Ľavý horný roh',
  topRight: 'Pravý horný roh',
  bottomRight: 'Pravý dolný roh',
  bottomLeft: 'Ľavý dolný roh'
} as const;

/**
 * Get edge label by key
 */
export function getEdgeLabel(edge: keyof typeof EDGE_LABELS): string {
  return EDGE_LABELS[edge];
}

/**
 * Get edge option label by value
 */
export function getEdgeOptionLabel(value: EdgeValue): string {
  const option = EDGE_OPTIONS.find(opt => opt.value === value);
  return option?.label || 'Neznámy';
}

/**
 * Get corner label by position
 */
export function getCornerLabel(corner: CornerPosition): string {
  return CORNER_LABELS[corner];
}
