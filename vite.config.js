// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [],
    server: {
        host: '0.0.0.0', // 监听所有 IP 地址
        port: 5173, // 你可以指定一个端口
    },
});
