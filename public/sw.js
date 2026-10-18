// Service Worker：让 App 在没网的时候也能打开。
// 策略：网络优先。有网时总是拿最新版本并顺便存进缓存；没网时用缓存。
const CACHE = 'money-app-v1'

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.add('./')))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  // 删除旧版本的缓存
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone()
          caches.open(CACHE).then((cache) => cache.put(request, copy))
        }
        return response
      })
      .catch(async () => {
        const cached = await caches.match(request)
        // 页面请求找不到缓存时，退回首页
        return cached ?? (request.mode === 'navigate' ? caches.match('./') : Response.error())
      }),
  )
})
