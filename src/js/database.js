/* GameVault browser database: IndexedDB, no backend required. */
(function () {
  const DB_NAME = "GameVaultPremiumDB";
  const DB_VERSION = 2;
  let connection;

  function openDB() {
    if (connection) return connection;
    connection = new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) {
        reject(new Error("Browser ini tidak mendukung IndexedDB."));
        return;
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("games")) db.createObjectStore("games", { keyPath: "id" });
        if (!db.objectStoreNames.contains("wishlist")) db.createObjectStore("wishlist", { keyPath: "id" });
        if (!db.objectStoreNames.contains("settings")) db.createObjectStore("settings", { keyPath: "key" });
        if (!db.objectStoreNames.contains("purchased")) db.createObjectStore("purchased", { keyPath: "id" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Database gagal dibuka."));
    });
    return connection;
  }

  function requestResult(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Operasi database gagal."));
    });
  }

  async function getAll(storeName) {
    const db = await openDB();
    const tx = db.transaction(storeName, "readonly");
    return requestResult(tx.objectStore(storeName).getAll());
  }

  async function seedGames(games) {
    const existing = await getAll("games");
    if (existing.length) return existing;
    const db = await openDB();
    const tx = db.transaction("games", "readwrite");
    const store = tx.objectStore("games");
    games.forEach(game => store.put(game));
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error || new Error("Katalog gagal disimpan."));
      tx.onabort = () => reject(tx.error || new Error("Penyimpanan katalog dibatalkan."));
    });
    return getAll("games");
  }

  async function getWishlistIds() {
    return (await getAll("wishlist")).map(item => Number(item.id)).filter(Number.isFinite);
  }

  async function setWishlisted(gameId, isWishlisted) {
    const db = await openDB();
    const tx = db.transaction("wishlist", "readwrite");
    const store = tx.objectStore("wishlist");
    if (isWishlisted) store.put({ id: Number(gameId), savedAt: new Date().toISOString() });
    else store.delete(Number(gameId));
    return new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error || new Error("Wishlist gagal disimpan."));
      tx.onabort = () => reject(tx.error || new Error("Perubahan wishlist dibatalkan."));
    });
  }

  async function getStats() {
    const db = await openDB();
    const tx = db.transaction(["games", "wishlist"], "readonly");
    const gamesCount = await requestResult(tx.objectStore("games").count());
    const wishlistCount = await requestResult(tx.objectStore("wishlist").count());
    return { games: gamesCount, wishlist: wishlistCount, database: DB_NAME };
  }

  async function getPurchasedIds() {
    return (await getAll("purchased")).map(item => Number(item.id)).filter(Number.isFinite);
  }

  async function isPurchased(gameId) {
    const ids = await getPurchasedIds();
    return ids.includes(Number(gameId));
  }

  async function setPurchased(gameId, paymentDetails) {
    const db = await openDB();
    const tx = db.transaction("purchased", "readwrite");
    const store = tx.objectStore("purchased");
    const record = {
      id: Number(gameId),
      purchasedAt: new Date().toISOString(),
      ...paymentDetails
    };
    store.put(record);
    return new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error || new Error("Data pembelian gagal disimpan."));
      tx.onabort = () => reject(tx.error || new Error("Penyimpanan pembelian dibatalkan."));
    });
  }

  window.GameVaultDB = { openDB, seedGames, getAll, getWishlistIds, setWishlisted, getStats, getPurchasedIds, isPurchased, setPurchased };
})();
