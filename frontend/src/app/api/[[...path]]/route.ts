import { NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

function joinPath(parts?: string[]) {
  if (!parts || parts.length === 0) return "";
  return parts.join("/");
}

async function handler(req: NextRequest, ctx: { params: { path?: string[] } }) {
  const url = new URL(req.url);

  const path = joinPath(ctx.params.path);
  const target = `${BACKEND_URL}/${path}${url.search}`;

  const headers = new Headers(req.headers);
  headers.delete("host");

  const method = req.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);
  const body = hasBody ? await req.arrayBuffer() : undefined;

  const upstream = await fetch(target, {
    method,
    headers,
    body,
    cache: "no-store",
  });

  const respHeaders = new Headers(upstream.headers);
  // чтобы не было конфликтов при проксировании
  respHeaders.delete("content-encoding");
  respHeaders.delete("transfer-encoding");
  respHeaders.delete("connection");

  return new Response(upstream.body, {
    status: upstream.status,
    headers: respHeaders,
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
