const FILES_TO_CACHE = [
  "./index.html",
  "./styles.css",
  "./idb.js",
  "./index.js",
];

const APP_PREFIX = "BudgetBucket-";
const VERSION = "version_01";
CACHE_NAME = APP_PREFIX + VERSION;
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("installing cache :" + CACHE_NAME);
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});
