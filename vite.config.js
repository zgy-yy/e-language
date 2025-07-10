// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [],
    server: {
        watch: {
            ignored: ['!**/public/**'],
        },
        host: '0.0.0.0', // 监听所有 IP 地址
        port: 5199,
    },
});
