'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const sample = path.join(root, '.env.example');
const dest = path.join(root, '.env');
if (!fs.existsSync(dest)) {
  fs.copyFileSync(sample, dest, fs.constants.COPYFILE_EXCL);
  console.log('Konfigurasi .env dibuat. Ganti ADMIN_EMAILS dan isi SMTP untuk email sungguhan.');
} else console.log('File .env sudah ada; tidak ditimpa.');
console.log('Lanjutkan: npm run dev (pengembangan) atau npm start (menjalankan server).');
