# GameVault Premium

Website katalog game dengan HTML, CSS, dan JavaScript. Versi ini memakai **IndexedDB sebagai database lokal di browser**, jadi tidak memerlukan backend atau server database. Katalog awal diimpor dari `data/games.json` ke database browser saat pertama dijalankan; wishlist disimpan sebagai record di IndexedDB, bukan `localStorage`.

> **Penting:** IndexedDB adalah database di perangkat/browser pengguna. Data tidak otomatis tersinkronisasi ke perangkat lain dan dapat hilang jika data situs/browser dihapus. Tanpa backend, database tidak dapat dibagi oleh semua pengguna. `database/schema.mysql.sql` hanya referensi skema jika suatu saat aplikasi dikembangkan dengan backend; file SQL tersebut tidak aktif/terhubung pada versi ini.

## Menjalankan website

Dari terminal di folder `GameVault_Frontend`:

```powershell
npm run dev
```

Buka `http://localhost:8899`. Alternatif jika Python tersedia:

```powershell
npm run dev:python
```

Jangan membuka `index.html` langsung dengan `file://`; browser perlu server lokal agar bisa mengambil file JSON.

## Fitur

- Katalog 291 game unik dengan 21 genre dan dukungan banyak genre per game.
- Pencarian, filter genre/platform, pengurutan rating/nama, detail game, dan wishlist.
- Database browser IndexedDB bernama `GameVaultPremiumDB` dengan object store `games`, `wishlist`, dan `settings`.
- Katalog di-seed dari JSON hanya ketika tabel game di IndexedDB masih kosong.
- Referensi skema MySQL untuk pengembangan di masa depan, tanpa backend aktif.
- Test otomatis untuk katalog dan integrasi database.

## Struktur proyek

```text
GameVault_Frontend/
├── index.html
├── data/
│   └── games.json
├── database/
│   └── schema.mysql.sql       # referensi saja; tidak aktif tanpa backend
├── mocks/
│   └── data-contoh.json
├── src/
│   ├── js/
│   │   ├── database.js        # IndexedDB browser
│   │   └── script.js          # logika UI
│   └── css/
│       └── style.css
├── tests/
│   ├── check_catalog.js
│   └── check_database.js
├── assets/images/
├── docs/
└── package.json
```

## Memeriksa database

1. Jalankan website melalui `npm run dev`.
2. Buka Developer Tools browser (F12) → **Application** → **IndexedDB**.
3. Pilih `GameVaultPremiumDB`; periksa `games` dan `wishlist`.
4. Tambahkan game ke wishlist lalu periksa record di object store `wishlist`.

## Tes

```powershell
npm test
node --check src/js/database.js
node --check src/js/script.js
```

## Catatan

Rating, deskripsi, tag, dan label usia merupakan data katalog kurasi untuk demonstrasi, bukan feed langsung dari toko game. Gambar cover eksternal memerlukan internet. Referensi skema MySQL bukan database server aktif; untuk akun, sinkronisasi lintas perangkat, atau wishlist per pengguna, aplikasi kelak membutuhkan backend.
