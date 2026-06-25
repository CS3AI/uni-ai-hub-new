// 极简 Service Worker：只缓存"应用外壳"（首页路由 + 图标），
// 让用户离线/弱网时也能打开 App，不缓存数据接口，保证信息始终是最新的。
const CACHE_NAME = "uni-ai-hub-shell-v1";
const SHELL_ASSETS = ["/", "/manifest.json", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  // 网络优先，失败时才用缓存兜底——避免把过期内容当成"实时数据"展示。
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.ok && SHELL_ASSETS.includes(new URL(request.url).pathname)) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
