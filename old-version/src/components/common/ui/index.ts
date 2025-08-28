/**
 * UI Component Library
 *
 * This is the entry point for all basic UI components.
 * Import components from here instead of directly from their files.
 *
 * MIGRATION NOTES:
 * - We are gradually migrating from feature-specific styled components to this shared library
 * - Some components (like ConfigBadge) exist in both places during transition
 * - Always prefer importing from here rather than from feature-specific files
 * - When making changes to UI components, update them here first
 */

// Export our component library
export * from './Button'
export * from './Card'
export * from './Input'
export * from './Select'
export * from './Checkbox'
export * from './Tab'
export * from './FormField'
export * from './FormGroup'
export * from './SelectableItem'
export * from './Grid'
export * from './Text'
export * from './EmptyState'
export * from './ToggleGroup'
export * from './Toggle'
export * from './Badge'
export * from './Tooltip'
export * from './ConfigBadge'
export * from './LoadingIndicator'
export * from './DomainComponents'

// We've migrated all necessary components from CommonStyles
// The following backward compatibility exports will be removed
// once all references are updated to use the new Button component
import { Button } from './Button'
import styled from 'styled-components'

// Legacy button compatibility wrappers
export const PrimaryButton = styled(Button).attrs({ variant: 'primary' })``
export const SecondaryButton = styled(Button).attrs({ variant: 'secondary' })``
export const DangerButton = styled(Button).attrs({ variant: 'danger' })``
export const SmallButton = styled(Button).attrs({ size: 'small' })``
