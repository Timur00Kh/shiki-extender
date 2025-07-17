import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest(({ mode }) => ({
    manifest_version: 3,
    name: 'Shiki Extender',
    version: '1.0.5',
    description: 'Chrome-расширение для Shikimori',
    background: {
        service_worker: 'src/background.js',
        type: 'module',
    },
    action: {
        default_title: 'Shiki extender',
        default_popup: 'index.html#options?popup=true',
    },
    options_ui: {
        page: 'index.html#options',
        open_in_tab: true,
    },
    content_scripts: [
        {
            matches: [
                'https://shikimori.one/*',
                'https://shikimori.org/*',
            ],
            js: ['src/executable/AltWhatcher/altWatcher.js'],
            run_at: 'document_end',
        },
    ],
    web_accessible_resources: [
        {
            resources: ['libs/*', 'assets/*'],
            matches: [
                'https://shikimori.one/*',
                'https://shikimori.org/*',
            ],
        },
        // Добавляем поддержку dev сервера
        ...(mode === 'development'
            ? [
                {
                    resources: ['*'],
                    matches: ['<all_urls>'],
                },
            ]
            : []),
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
}));