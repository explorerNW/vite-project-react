const CACHE_NAME = 'my-cache-v1';

self.addEventListener('install', event => {
  // 在安装过程中，可以选择缓存一些静态资源
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(['/', '{bundlers}']);
    })
  );
});

// 拦截网络请求事件
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request).then(function (response) {
        // Check if we received a valid response
        if (!response || response.status !== 200) {
          return response;
        }
        // IMPORTANT: Clone the response. A response is a stream
        // and because we want the browser to consume the response
        // as well as the cache consuming the response, we need
        // to clone it so we have two streams.
        if (event.request.method !== 'POST') {
          var responseToCache = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, responseToCache);
          });
        }

        return response;
      });
    })
  );
});

const DB_NAME = 'myDatabase';
const OBJECT_STORE_NAME = 'postResponses';
let db;

// 打开并初始化IndexedDB数据库
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = event => {
      db = event.target.result;
      if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
        db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'url' });
      }
    };
    request.onsuccess = () => {
      db = request.target.result;
      resolve();
    };
    request.onerror = event => {
      reject(event.target.error);
    };
  });
}

// 存储响应到IndexedDB
function storeResponseInIndexedDB(url, response) {
  response.json().then(body => {
    const transaction = db.transaction([OBJECT_STORE_NAME], 'readwrite');
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME);
    const requestData = {
      url: url,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers.toJSON(), // 注意：headers需要转换为JSON
      body: body,
    };
    objectStore.put(requestData);
  });
}

// 从IndexedDB中检索响应
function retrieveResponseFromIndexedDB(url) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([OBJECT_STORE_NAME], 'readonly');
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME);
    const request = objectStore.get(url);
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      resolve(null); // 如果没有找到，返回null
    };
  });
}
