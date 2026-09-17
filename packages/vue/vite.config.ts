import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import {defineConfig} from "vite";
import {resolve} from "path";
import {fileURLToPath} from "node:url";

export default defineConfig({
    plugins: [
        vue(),
        dts({
            include: [
                'src/**/*.ts',
                'src/**/*.vue'
            ]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        lib: {
            entry: resolve(import.meta.dirname, 'src/index.ts'),
            name: 'v-grid-vue',
            fileName: (format) => `v-grid-vue.${format}.js`
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {vue: 'Vue'}
            }
        }
    }
})