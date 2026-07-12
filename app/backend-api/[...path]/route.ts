const apiUrl = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://rps-arena-2q2f.onrender.com/api/v1"
).replace(/\/$/, "");

type ProxyContext = {
  params: Promise<{ path: string[] }>;
};

async function proxyRequest(request: Request, context: ProxyContext) {
  const { path } = await context.params;
  const incomingUrl = new URL(request.url);
  const targetUrl = `${apiUrl}/${path.map(encodeURIComponent).join("/")}${incomingUrl.search}`;
  const headers = new Headers(request.headers);

  // The deployed backend currently throws during REST CORS processing when an
  // Origin header is present. This is a server-to-server request, so browser
  // CORS and transport headers should not be forwarded upstream.
  headers.delete("origin");
  headers.delete("host");
  headers.delete("content-length");
  headers.delete("accept-encoding");
  for (const key of [...headers.keys()]) {
    if (key.startsWith("sec-fetch-")) headers.delete(key);
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const upstream = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
    cache: "no-store",
  });

  const responseHeaders = new Headers(upstream.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");
  responseHeaders.delete("transfer-encoding");

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const HEAD = proxyRequest;
