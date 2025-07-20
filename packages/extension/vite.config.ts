import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.config';
import { fileURLToPath } from 'url';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [
        vue(),
        crx({ manifest }),
        viteStaticCopy({
            targets: [
                { src: 'src/libs/jquery.min.js', dest: 'libs' },
                { src: 'src/libs/jquery.highlight-within-textarea.js', dest: 'libs' },
                { src: 'src/libs/db.js', dest: 'libs' },
            ],
        }),
    ],
    resolve: {
        alias: {
            'pages': path.resolve(__dirname, 'src/options/pages'),
            'router': path.resolve(__dirname, 'src/options/router'),
            'components': path.resolve(__dirname, 'src/options/components'),
            'utils': path.resolve(__dirname, 'src/utils'),
            'libs': path.resolve(__dirname, 'src/libs'),
        },
    },
    server: {
        port: 5173,
        strictPort: true,
        host: 'localhost',
        hmr: {
            port: 5174,
        },
    },
    build: {
        sourcemap: true,
        outDir: path.resolve(__dirname, './dist'),
        emptyOutDir: true,
    },
    css: {
        preprocessorOptions: {
            scss: {
                quietDeps: true,
            },
        },
    },
});