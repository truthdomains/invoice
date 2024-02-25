import indexHtml from './index.html';

const server = Bun.serve({
  async fetch(req) {
    const path = new URL(req.url).pathname;

    if (path === '/') return new Response(Bun.file(indexHtml, { type: 'text/html' }));
    if (path === '/index.mjs') return new Response(Bun.file('./src/index.mjs', { type: 'text/javascript' }));
    if (path === '/helpers.mjs') return new Response(Bun.file('./src/helpers.mjs', { type: 'text/javascript' }));
    if (path === '/styles.css') return new Response(Bun.file('./src/styles.css', { type: 'text/css' }));

    // 404s
    return new Response('Page not found', { status: 404 });
  },
  development: true,
  port: process.env.port || 1234,
});

console.log(`Listening on ${server.url}`);
