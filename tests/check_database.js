const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const db = fs.readFileSync(path.join(root, 'src/js/database.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const store of ['games', 'wishlist', 'settings']) {
  if (!db.includes(`"${store}"`)) throw new Error(`Object store ${store} belum didefinisikan`);
}
for (const api of ['seedGames', 'getAll', 'getWishlistIds', 'setWishlisted', 'getStats']) {
  if (!db.includes(api)) throw new Error(`API database ${api} belum tersedia`);
}
if (!html.includes('src/js/database.js') || !html.includes('src/js/script.js')) throw new Error('Script database atau aplikasi belum dimuat');
if (!fs.existsSync(path.join(root, 'database/schema.mysql.sql'))) throw new Error('Referensi skema MySQL tidak ada');
console.log('OK: IndexedDB stores, API database, integrasi HTML, dan referensi skema MySQL tersedia.');
