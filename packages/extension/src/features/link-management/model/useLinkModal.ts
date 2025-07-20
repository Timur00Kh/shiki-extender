import { ref, watch } from 'vue';
import type { Link, ModalState } from '../../../entities/link/model/types';

export function useLinkModal() {
  const modal = ref<ModalState>({
    isOpen: false,
    data: null,
    mode: 'create'
  });

  const openModal = (link?: Link, mode: 'create' | 'edit' = 'edit'): void => {
    modal.value = {
      isOpen: true,
      data: link ? JSON.parse(JSON.stringify({
        ...link,
        publish: link.publish || false
      })) : {
        title: '',
        link: '',
        description: '',
        tags: {
          anime: 0,
          manga: 0,
          ranobe: 0
        },
        publish: false
      },
      mode
    };

    // Гениальный костыль за 2 сек
    setTimeout(() => {
      const textarea = document.getElementById('highlight') as HTMLTextAreaElement;
      if (textarea) {
        ($(textarea) as any).highlightWithinTextarea({
          highlight: [
            {
              highlight: '{{id}}',
              className: 'blue'
            },
            {
              className: 'blue',
              highlight: /\{\{title=?(.*?)\}\}/g
            },
            {
              highlight: "{{episode}}",
              className: 'blue'
            }
          ]
        });
      }
    }, 300);
  };

  const closeModal = (): void => {
    modal.value = {
      isOpen: false,
      data: {
        title: '',
        link: '',
        description: '',
        tags: {
          anime: 0,
          manga: 0,
          ranobe: 0
        },
        publish: false
      },
      mode: 'create'
    };
  };

  const insertTextAtCursor = (text: string, offset?: number): void => {
    const textarea = document.getElementById('highlight') as HTMLTextAreaElement;
    if (!textarea || !modal.value.data) return;

    const val = textarea.value;
    const endIndex = textarea.selectionEnd;
    
    modal.value.data.link = val.slice(0, endIndex) + text + val.slice(endIndex);
    
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = endIndex + text.length + (offset || 0);

    setTimeout(() => {
      ($(textarea) as any).highlightWithinTextarea('update');
    }, 10);
  };

  // Watchers
  watch(modal, (newModal) => {
    const body = document.querySelector('body');
    if (body) {
      if (newModal.isOpen) {
        body.classList.add("modal-open");
      } else {
        body.classList.remove("modal-open");
      }
    }
  });

  return {
    modal,
    openModal,
    closeModal,
    insertTextAtCursor
  };
}