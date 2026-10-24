const backendOrigin = 'https://pazthrivingtribebackend.vercel.app';
const requestHeadersToSkip = new Set([
  'connection',
  'content-length',
  'host',
  'transfer-encoding',
]);
const responseHeadersToSkip = new Set([
  'connection',
  'content-encoding',
  'content-length',
  'keep-alive',
  'transfer-encoding',
  'upgrade',
]);

export const config = { api: { bodyParser: false } };

async function readRequestBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  try {
    const target = new URL(req.url, backendOrigin);
    const headers = new Headers();
    for (const [name, value] of Object.entries(req.headers || {})) {
      if (value == null || requestHeadersToSkip.has(name.toLowerCase())) continue;
      headers.set(name, Array.isArray(value) ? value.join(', ') : String(value));
    }

    const hasBody = !['GET', 'HEAD'].includes(String(req.method || 'GET').toUpperCase());
    const response = await fetch(target, {
      method: req.method,
      headers,
      body: hasBody ? await readRequestBody(req) : undefined,
      redirect: 'manual',
    });

    res.statusCode = response.status;
    for (const [name, value] of response.headers) {
      if (!responseHeadersToSkip.has(name.toLowerCase())) res.setHeader(name, value);
    }
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error('Backend API proxy failed:', error?.message || error);
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'The API service is temporarily unavailable.' }));
  }
}