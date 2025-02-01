const server = Bun.serve({
  async fetch(req) {
    const path = new URL(req.url).pathname;

    if (path.startsWith('/images/')) {
      return new Response(Bun.file(`./public/${path}`, { type: 'image/png' }));
    }

    switch (path) {
      case '/':
        return new Response(Bun.file('./src/index.html', { type: 'text/html' }));
      case '/index.mjs':
        return new Response(Bun.file('./src/index.mjs', { type: 'text/javascript' }));
      case '/helpers.mjs':
        return new Response(Bun.file('./src/helpers.mjs', { type: 'text/javascript' }));
      case '/styles.css':
        return new Response(Bun.file('./src/styles.css', { type: 'text/css' }));
      default:
        return new Response('Page not found', { status: 404 });
    }

    // 404s
  },
  development: true,
  port: process.env.port || 1234,
});

console.log(`Listening on ${server.url}`);
