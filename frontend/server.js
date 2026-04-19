/* eslint-disable @typescript-eslint/no-require-imports */
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

// Initialize Next.js in dev mode
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl).catch((err) => {
      console.error('Error handling request', err);
      res.statusCode = 500;
      res.end('internal server error');
    });
  }).listen(port, () => {
    console.log(`> Custom dev server ready on http://${hostname}:${port} (PID: ${process.pid})`);
  });
});
