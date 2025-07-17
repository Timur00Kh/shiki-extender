import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest(({ mode }) => ({
    manifest_version: 3,
    name: 'Shiki Extender',
    version: '0.0.1',
    description: 'Chrome-расширение для Shikimori',
    background: {
        service_worker: 'src/background.js',
        type: 'module',
    },
    action: {
        default_popup: 'index.html',
    },
    options_page: 'index.html',
    content_scripts: [
        {
            matches: ['https://shikimori.one/*', 'https://shikimori.org/*'],
            js: ['src/executable/AltWhatcher/altWatcher.js'],
            run_at: 'document_end',
        },
    ],
    web_accessible_resources: [
        {
            resources: ['libs/*', 'assets/*'],
            matches: ['<all_urls>'],
        },
        // Добавляем поддержку dev сервера
        ...(mode === 'development' ? [{
            resources: ['*'],
            matches: ['<all_urls>'],
        }] : []),
    ],
    permissions: [
        'storage',
        'tabs',
        'scripting',
        'activeTab',
    ],
    host_permissions: [
        'https://shikimori.one/*',
        'https://shikimori.org/*',
        // Добавляем localhost для dev режима
        ...(mode === 'development' ? ['http://localhost:*/*'] : []),
    ],
    // Убираем CSP - пусть crxjs сам управляет
}));