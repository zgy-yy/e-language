// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        {
            name: 'watch-public-files',
            configureServer(server) {
              const chokidar = require('chokidar');
              // 监听 public 目录中的文件变化
              chokidar.watch('public/**/*.e').on('change', (path) => {
                console.log(`File changed: ${path}`);
                server.ws.send({
                  type: 'full-reload',
                });
              });
            },
          },
    ],
    server: {
        watch: {
            ignored: ['!**/public/**'],
        },
        host: '0.0.0.0', // 监听所有 IP 地址
        port: 5199,
    },
});
