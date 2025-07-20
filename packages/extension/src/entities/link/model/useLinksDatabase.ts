import { ref, Ref } from 'vue';
import type { LinksDatabase, Link } from './types';
import { sortByUsedTimes } from '../../../../utils/utils';

export function useLinksDatabase() {
  const linksDb = ref<LinksDatabase | null>(null);
  const loading = ref(true);
  const links = ref<Link[]>([]);

  const initDatabase = async (): Promise<void> => {
    try {
      const serv = await window.db.open({
        server: 'linksDb',
        version: 1,
        schema: {
          link: {
            key: { keyPath: 'hash_id', autoIncrement: true, unique: true },
          }
        }
      });
      linksDb.value = serv;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  };

  const updateLinks = async (): Promise<void> => {
    if (!linksDb.value) return;

    try {
      const results = await linksDb.value.link.query().all().execute();
      
      if (!results || !Array.isArray(results)) {
        throw new Error('Invalid database results');
      }

      const processedResults = results.map((link: Link) => {
        if (link.favicon) {
          return link;
        } else {
          try {
            const origin = new URL(link.link).origin;
            const favicon = origin + '/favicon.ico';
            return {
              ...link,
              favicon: favicon
            };
          } catch (error) {
            return link;
          }
        }
      });

      processedResults.sort(sortByUsedTimes);
      
      setTimeout(() => {
        links.value = processedResults;
        loading.value = false;
      }, 300);
    } catch (error) {
      console.error('Failed to update links:', error);
      alert('Что-то пошло не так. F12, скрин консоли в группу');
    }
  };

  const resetLinksUses = async (): Promise<void> => {
    if (!linksDb.value || !confirm('Вы уверены?')) return;

    try {
      const results = await linksDb.value.link.query().all().execute();
      const updatedLinks = results.map((link: Link) => ({
        ...link,
        used: 0
      }));

      for (const link of updatedLinks) {
        await linksDb.value.link.put(link);
      }

      await updateLinks();
    } catch (error) {
      console.error('Failed to reset links uses:', error);
    }
  };

  return {
    linksDb,
    loading,
    links,
    initDatabase,
    updateLinks,
    resetLinksUses
  };
}