import { NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

function buildTargetUrl(req: NextRequest, pathParts: string[]) {
  const url = new URL(req.url);
  const path = pathParts.join("/");
  // сохраняем query string (?a=1&b=2)
  return `${BACKEND_URL}/${path}${url.search}`;
}

async function proxy(req: NextRequest, ctx: { params: { path: string[] } }) {
  const targetUrl = buildTargetUrl(req, ctx.params.path);

  // Копируем заголовки (кроме host)
  const headers = new Headers(req.headers);
  headers.delete("host");

  // Тело только для методов с body
  const method = req.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);
  const body = hasBody ? await req.arrayBuffer() : undefined;

  const upstream = await fetch(targetUrl, {
    method,
    headers,
    body,
    // важно: чтобы не кешировалось
    cache: "no-store",
  });

  // Возвращаем ответ как есть, но убираем проблемные заголовки
  const respHeaders = new Headers(upstream.headers);
  respHeaders.delete("content-encoding");
  respHeaders.delete("transfer-encoding");
  respHeaders.delete("connection");

  return new Response(upstream.body, {
    status: upstream.status,
    headers: respHeaders,
  });
}

// Поддерживаем все методы
export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
