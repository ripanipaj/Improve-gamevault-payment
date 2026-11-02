-- REFERENSI SKEMA MYSQL UNTUK PENGEMBANGAN MASA DEPAN.
-- Website versi ini TIDAK menghubungkan file SQL ini karena tidak menggunakan backend.
-- Database yang aktif saat ini adalah IndexedDB di browser pengguna.
CREATE DATABASE IF NOT EXISTS gamevault_premium
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gamevault_premium;

CREATE TABLE IF NOT EXISTS games (
  id INT PRIMARY KEY,
  title VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  release_date VARCHAR(40),
  rating DECIMAL(2,1) NOT NULL DEFAULT 0,
  age_rating VARCHAR(12) DEFAULT 'NR',
  image_url TEXT,
  platforms JSON,
  genres JSON,
  tags JSON
);

CREATE TABLE IF NOT EXISTS wishlist (
  game_id INT NOT NULL,
  saved_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (game_id),
  CONSTRAINT fk_wishlist_game FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- Jika kelak ditambahkan backend dan akun pengguna, wishlist perlu user_id
-- dan tabel users. Jangan menyimpan password pengguna di frontend.
