import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
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
            matches: ['<all_urls>'],
            js: ['src/executable/AltWhatcher/altWatcher.js'],
            run_at: 'document_end',
        },
    ],
    web_accessible_resources: [
        {
            resources: ['*'],
            matches: ['<all_urls>'],
        },
    ],
    permissions: [
        'storage',
        'tabs',
        'scripting',
        'activeTab',
    ],
}); 