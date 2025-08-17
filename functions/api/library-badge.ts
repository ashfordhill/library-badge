// Cloudflare Pages Function
export const onRequestGet: PagesFunction = async ({ request, env }) => {
  // Read the static file we just published
  const url = new URL(request.url);
  const jsonReq = new Request(new URL("/library.json", url).toString());

  // On Pages, ASSETS binding lets you fetch your static assets
  // @ts-ignore env.ASSETS provided by CF
  const assetRes = await env.ASSETS.fetch(jsonReq);
  let data: any = null;
  if (assetRes.ok) {
    try { 
      data = await assetRes.json(); 
    } catch (e) {
      console.error("Failed to parse library.json:", e);
    }
  }

  const title = data?.title ?? null;
  const author = data?.author ?? null;
  const message = title
    ? `${title}${author ? " — " + author : ""}`.slice(0, 64)
    : "none";

  const body = {
    schemaVersion: 1,
    label: "last read",
    message,
    color: title ? "blue" : "inactive",
    namedLogo: "bookstack"
  };

  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=1800", // 30 min; tune as you like
      "Access-Control-Allow-Origin": "*"
    }
  });
};