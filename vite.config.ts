import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';

// const localhostAddress = 'https://codegeneratorvm.com.br:8443';
const localhostAddress = 'http://127.0.0.1:8330';
// const localhostAddress = 'https://whole-monitor-preferably.ngrok-free.app';

export default defineConfig({
    // depending on your application, base can also be "/"
    base: '',
    plugins: [react(), viteTsconfigPaths()],
    define: {
        APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
    server: {
        // this ensures that the browser opens upon server start
        open: true,
        // this sets a default port to 3000  
        port: 3000,
        proxy: {
            '/api': {
                target: localhostAddress,
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        }
    },
})