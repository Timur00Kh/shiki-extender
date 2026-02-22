import type { LinkRecord } from "./db";

/**
 * Ссылки, подставляемые при первой установке расширения (если в IndexedDB пусто).
 * Позже можно заменить на загрузку с бэкенда (Convex/Supabase).
 */
export const DEFAULT_LINKS: Omit<LinkRecord, "hash_id" | "favicon">[] = [
  {
    id: 2,
    title: "Anime 365",
    link: "https://smotret-anime.online/catalog/search?q={{title}}",
    tags: { manga: 0, anime: 2, ranobe: 0 },
    approved: true,
    number_of_downloads: 28,
    description:
      "Платный агрегатор озвучек и переводов. Хостит видео самостоятельно. Так же известен как Smotret Anime.",
  },
  {
    id: 19,
    title: "Animego",
    link: "https://animego.org/search/all?q={{title}}",
    tags: { manga: 2, anime: 2, ranobe: 0 },
    approved: true,
    number_of_downloads: 10,
    description:
      "Вроде неплохой сайт с крутым дизайном. В наличие только озвучка. По манге можно вести только список.",
  },
  {
    id: 9,
    title: "AniDub",
    link: "https://online.anidub.com/index.php?do=search&subaction=search&search_start=1&full_search=0&result_from=1&story={{title}}",
    tags: { manga: 0, anime: 2, ranobe: 0 },
    approved: true,
    number_of_downloads: 6,
    description: "",
  },
  {
    id: 20,
    title: "MangaHub",
    link: "https://mangahub.ru/search?query={{title}}",
    tags: { manga: 2, anime: 0, ranobe: 0 },
    approved: true,
    number_of_downloads: 2,
    description:
      "Сайт для удобного чтения манги онлайн. Большой каталог манги.",
  },
  {
    id: 4,
    title: "Mangawindow",
    link: "https://mangawindow.net/search?q={{title}}",
    tags: { manga: 3, anime: 0, ranobe: 0 },
    approved: true,
    number_of_downloads: 13,
    description: "Манга на английском и других языках",
  },
  {
    id: 32,
    title: "Rutracker",
    link: "https://rutracker.org/forum/tracker.php?nm={{title}}",
    tags: { manga: 2, anime: 2, ranobe: 2 },
    approved: false,
    number_of_downloads: 1,
    description: "",
  },
  {
    id: 6,
    title: "Vk",
    link: "https://vk.com/video?q={{title}}",
    tags: { manga: 0, anime: 3, ranobe: 0 },
    approved: true,
    number_of_downloads: 5,
    description: "Вк — раздолье для пиратов",
  },
];
