# GameVault - Payment Gateway Improvement

Aplikasi web katalog game interaktif berbasis Client-Side (Single Page Application / SPA) yang memanfaatkan **IndexedDB** untuk penyimpanan data lokal tanpa dependensi backend database MySQL.

> **Penting:** IndexedDB adalah database di browser pengguna. Data tidak otomatis tersinkronisasi antar perangkat dan dapat hilang jika data situs/browser dihapus.

---

## 🚀 Fitur Utama

- **Katalog & Detail Game:**
  - Katalog 291 game unik dengan 21 genre dan dukungan multiple genre per game.
  - Pencarian global, filter genre & platform, pengurutan rating/nama.
  - Penilaian aksesibilitas 10 aspek pada detail game.
  - Manajemen **Wishlist** yang disimpan langsung ke IndexedDB.

- **Langganan Email & Fitur Admin:**
  - Verifikasi email (passwordless login).
  - Berlangganan notifikasi game baru dan update topik game favorit.
  - Dashboard Admin untuk pengelolaan katalog game, topik, subscriber, dan log audit.

- **[NEW] Payment Gateway UI:**
  - **Simulasi Checkout Game:** Pembelian game langsung dari halaman detail.
  - **Metode Pembayaran Lengkap:** Pilihan pembayaran via QRIS, E-Wallet (GoPay/OVO/Dana), Transfer Bank (BCA/Mandiri/BNI), dan Kartu Kredit/Debit.
  - **Kalkulasi Biaya Otomatis:** Menghitung harga game dan biaya penanganan (handling fee) secara otomatis.
  - **Penyimpanan Transaksi:** Data transaksi disimpan ke object store `purchased` pada IndexedDB (`GameVaultPremiumDB` versi 2).
  - **Status Kepemilikan (Owned):** Mengubah status tombol menjadi **✓ Owned** secara real-time setelah pembayaran berhasil.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend:** HTML5, CSS3, JavaScript (ES6+ Native SPA)
- **Database Lokal:** IndexedDB (`GameVaultPremiumDB`)
- **Backend Pendukung / Server:** Node.js (HTTP Native Server & Email Notification)

---

## 💻 Cara Menjalankan Proyek Secara Lokal

1. **Clone Repositori:**
   ```bash
   git clone https://github.com/ripanipaj/Improve-gamevault-payment.git
   cd Improve-gamevault-payment
   ```

2. **Instal Dependensi:**
   ```bash
   npm install
   ```

3. **Inisialisasi Konfigurasi (Opsional):**
   ```bash
   npm run setup
   ```

4. **Jalankan Aplikasi:**
   ```bash
   npm run dev
   ```
   Buka browser dan akses `http://localhost:3000` (atau port yang tertera di terminal).

---

## 🧪 Menguji Fitur & Database

- **Jalankan Pengujian Otomatis:**
  ```bash
  npm test
  ```
- **Memeriksa IndexedDB di Browser:**
  1. Buka Developer Tools browser (`F12`) → **Application** → **IndexedDB**.
  2. Pilih `GameVaultPremiumDB`.
  3. Periksa object store `games`, `wishlist`, dan `purchased`.

---

## 👤 Kontributor / Author

Fitur **Payment Gateway & IndexedDB Purchased Store** dikembangkan oleh **[ripanipaj](https://github.com/ripanipaj)**.
