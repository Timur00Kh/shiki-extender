/**
 * LinkTag interface represents the type of content (anime, manga, ranobe)
 * with bitmap values: 0=none, 1=rx, 2=normal, 3=both
 */
export interface LinkTag {
  anime: number;  // bitmap: 0=none, 1=rx, 2=normal, 3=both
  manga: number;
  ranobe: number;
}

/**
 * Link interface represents a link item with metadata
 */
export interface Link {
  hash_id?: string;
  id?: number;
  title: string;
  link: string;
  description: string;
  tags: LinkTag;
  used?: number;
  favicon?: string;
  publish?: boolean;
  action?: string;
}

/**
 * ModalState interface represents the state of modal dialogs
 */
export interface ModalState {
  isOpen: boolean;
  data: Link | null;
  mode: 'create' | 'edit' | 'view';
}

/**
 * SearchParams interface represents search parameters
 */
export interface SearchParams {
  query: string;
  tags: Partial<LinkTag>;
  limit: number;
  offset: number;
}

/**
 * Base component props interface
 */
export interface BaseComponentProps {
  disabled?: boolean;
  loading?: boolean;
  class?: string;
}

/**
 * Color picker interface
 */
export interface ColorPickerProps extends BaseComponentProps {
  modelValue: string;
  colors?: string[];
  label?: string;
}

/**
 * Button variants
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning';

/**
 * Button sizes
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Modal props interface
 */
export interface ModalProps extends BaseComponentProps {
  modelValue: boolean;
  title?: string;
  width?: string;
  height?: string;
  closeOnOverlay?: boolean;
  showCloseButton?: boolean;
}

/**
 * Toggle props interface
 */
export interface ToggleProps extends BaseComponentProps {
  modelValue: boolean;
  label?: string;
  description?: string;
}