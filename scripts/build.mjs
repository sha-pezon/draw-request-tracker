import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";

const files = {
  "/": ["index.html", "text/html; charset=utf-8"],
  "/index.html": ["index.html", "text/html; charset=utf-8"],
  "/styles.css": ["styles.css", "text/css; charset=utf-8"],
  "/app.js": ["app.js", "application/javascript; charset=utf-8"],
  "/config.js": ["config.js", "application/javascript; charset=utf-8"]
};

await mkdir("dist/server", { recursive: true });
await mkdir("dist/.openai", { recursive: true });

await writeFile(
  "config.js",
  `window.DRAWOPS_CONFIG = ${JSON.stringify(
    {
      supabaseUrl: process.env.SUPABASE_URL || "",
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "",
      companyDomain: process.env.COMPANY_DOMAIN || "pezonproperties.com"
    },
    null,
    2
  )};\n`
);

for (const [source] of Object.values(files)) {
  await copyFile(source, `dist/${source}`);
}
await copyFile(".openai/hosting.json", "dist/.openai/hosting.json");

const entries = {};
for (const [route, [source, contentType]] of Object.entries(files)) {
  entries[route] = {
    body: await readFile(source, "utf8"),
    contentType
  };
}

const server = `const assets = ${JSON.stringify(entries)};\n\nexport default {\n  async fetch(request) {\n    const url = new URL(request.url);\n    const asset = assets[url.pathname] || assets[\"/\"];\n    return new Response(asset.body, {\n      headers: {\n        \"content-type\": asset.contentType,\n        \"cache-control\": \"no-store\"\n      }\n    });\n  }\n};\n`;

await writeFile("dist/server/index.js", server);
