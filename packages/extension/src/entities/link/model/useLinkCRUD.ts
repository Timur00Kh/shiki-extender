import { ref, Ref } from 'vue';
import axios from 'axios';
import type { Link, LinksDatabase } from './types';
import { apiDomain } from '../../../config';

export function useLinkCRUD(database: Ref<LinksDatabase | null>, links: Ref<Link[]>) {

  const saveLink = async (link: Link): Promise<void> => {
    if (!database.value) return;

    const linkCopy = JSON.parse(JSON.stringify(link));
    const linksDbInstance = database.value;

    // Приводим данные в порядок, публикуем
    if (linkCopy.action === 'addNewLink') {
      delete linkCopy.action;
    }

    if ('publish' in linkCopy) {
      const publish = linkCopy.publish;
      delete linkCopy.publish;

      if (publish) {
        try {
          const { data: { id } } = await axios.post(`${apiDomain}/altWatcher/link`, {
            title: linkCopy.title,
            link: linkCopy.link,
            description: linkCopy.description,
            manga: linkCopy.tags.manga,
            anime: linkCopy.tags.anime,
            ranobe: linkCopy.tags.ranobe
          });
          linkCopy.id = id;
        } catch (error: any) {
          console.error('Failed to publish link:', error);
          alert(error.response?.data?.error || 'Что-то пошло не так');
          return;
        }
      }
    }

    // Добавляем в локал БД
    await linksDbInstance.link.put(linkCopy);

    // Синхронизируем данные с представлением
    if (linkCopy.hash_id && links.value.find(e => e.hash_id === linkCopy.hash_id)) {
      const index = links.value.findIndex(e => e.hash_id === linkCopy.hash_id);
      links.value[index] = linkCopy;
    } else {
      links.value.push(linkCopy);
    }
  };

  const deleteLink = async (hashId: string): Promise<void> => {
    if (!database.value) return;

    const linkToDelete = links.value.find(e => e.hash_id === hashId);
    if (linkToDelete) {
      await database.value.link.delete(hashId);
      const index = links.value.findIndex(e => e.hash_id === hashId);
      links.value.splice(index, 1);
    }
  };

  const addNewLink = (): Link => {
    return {
      action: "addNewLink",
      title: "",
      link: "",
      tags: {
        manga: 0,
        anime: 2,
        ranobe: 0,
      },
      description: '',
      publish: true
    };
  };

  return {
    saveLink,
    deleteLink,
    addNewLink
  };
}