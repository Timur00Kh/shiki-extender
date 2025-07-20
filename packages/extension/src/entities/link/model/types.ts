export interface Link {
  hash_id?: string;
  id?: number;
  title: string;
  link: string;
  description: string;
  favicon?: string;
  used?: number;
  tags: {
    anime: number;
    manga: number;
    ranobe: number;
  };
  publish?: boolean;
  action?: string;
}

export interface ModalState {
  isOpen: boolean;
  data: Link;
  mode: 'create' | 'edit';
}

export interface LinksDatabase {
  link: {
    query: () => {
      all: () => {
        execute: () => Promise<Link[]>;
      };
    };
    put: (link: Link) => Promise<void>;
    delete: (hashId: string) => Promise<void>;
  };
}

export interface ColorPicker {
  iteration: number;
  colors: string[];
  getColor: () => string;
}