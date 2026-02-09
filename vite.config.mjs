import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import Components from 'unplugin-vue-components/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    return {
        optimizeDeps: {
            noDiscovery: true
        },
        server: {
            allowedHosts: [
            'save-respectively-booking-don.trycloudflare.com'
            ]
        },
        plugins: [
            vue(),
            Components({
                resolvers: [PrimeVueResolver()]
            })
        ],
        resolve: {
            alias: 
                    {
                        '@': fileURLToPath(new URL('./src', import.meta.url))
                    }
                    
        },
        build: {
            outDir: (() => {
                return (env.VITE_ENV === 'prod')
                    ? 'dist/prod'
                    : (env.VITE_ENV === 'staging')
                        ? 'dist/staging'
                            : (env.VITE_ENV === 'dev')
                            ?'dist/dev':
                            'dist/local';
            })(),
        }
    }

});