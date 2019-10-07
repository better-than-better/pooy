importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

/**
 * More: 
 *   https://developers.google.com/web/tools/workbox/
 */

workbox.setConfig({debug: true});

/**
 * CacheFirst
 * 
 * 能命中缓存则拿缓存，否则发起网络请求，拿到结果并更新至缓存
 * 适合对返回结果实时性要求不高的请求，例如 静态资源
 * 
 * 默认不适用跨域的请求，但可以用 workbox.cacheableResponse.Plugin 来指定只缓存请求成功的结果
 */
workbox.routing.registerRoute(
  function({ url }) {
    return url.host === location.host && /\.(webp|jpeg|png|jpg|svg|gif|js|css)/.test(url.pathname);
  },
  new workbox.strategies.CacheFirst({
    cacheName: 'static-cache'
  })
);

/**
 * CacheFirst with cacheableResponse
 *
 * google font & ali cdn & my cdn
 */
workbox.routing.registerRoute(
  new RegExp(/^https:\/\/(fonts\.gstatic\.com|fonts\.googleapis\.com|at\.alicdn\.com|note-cdn\.hxtao\.xyz)/),
  new workbox.strategies.CacheFirst({
    cacheName: 'cross-domain-static-cache',
    plugins: [
      // 强制缓存第三方资源
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 30,  // 30 days
      })
    ]
  })
);

/**
 * CacheOnly
 * 
 * 直接使用 Cache 缓存的结果，并将结果返回给客户端，这种策略比较适合一上线就不会变的静态资源请求
 */
// workbox.routing.registerRoute(
//     new RegExp('static.com'),
//     new workbox.strategies.CacheOnly()
// );






/**
 * StaleWhileRevalidate
 * 
 * 有对应的 Cache 缓存结果就直接返回，
 * 在返回 Cache 缓存结果的同时会在后台发起网络请求拿到请求结果并更新 Cache 缓存
 * 保证用户最快速的拿到请求的结果
 * 
 * 适用于防止恶意调用 api
 */
workbox.routing.registerRoute(
  new RegExp('^https:\/\/note-api\.hxtao\.xyz'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'cross-domain-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 6
      })
    ]
  })
);





/**
 * NetworkFirst
 * 
 * 有网络同时更新缓存，若网络不可用则采用上次缓存的结果
 * 离线缓存的能力
 */
workbox.routing.registerRoute(
  new RegExp('^https:\/\/pooy\.hxtao\.xyz$'),
  new workbox.strategies.NetworkFirst()
);

/**
 * networkOnly
 * 
 * 直接强制使用正常的网络请求，并将结果返回给客户端，这种策略比较适合对实时性要求非常高的请求
 */
// workbox.routing.registerRoute(
//     new RegExp('immediate.com'),
//     workbox.strategies.networkOnly()
// );
