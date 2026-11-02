const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const catalogPath = path.join(__dirname, "..", "data", "games.json");
const games = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
assert.equal(games.length, 291, "Katalog harus berisi tepat 291 game");
assert.equal(new Set(games.map(game => game.id)).size, games.length, "ID game harus unik");
assert.equal(new Set(games.map(game => game.title.trim().toLocaleLowerCase())).size, games.length, "Judul game tidak boleh duplikat");
const genres = new Set(games.flatMap(game => game.genres || [game.genre]));
assert.equal(genres.size, 21, "Katalog harus memiliki 21 genre");
for (const game of games) {
  assert.ok(Number.isInteger(game.id), `ID tidak valid: ${game.title}`);
  assert.ok(game.title && game.title.trim(), `Judul kosong untuk ID ${game.id}`);
  assert.ok(Array.isArray(game.genres) && game.genres.length, `Genre kosong: ${game.title}`);
  assert.ok(Array.isArray(game.platforms) && game.platforms.length, `Platform kosong: ${game.title}`);
  assert.ok(typeof game.image === "string" && game.image.length, `Gambar kosong: ${game.title}`);
  assert.ok(Number.isFinite(game.rating) && game.rating >= 0 && game.rating <= 10, `Rating di luar rentang: ${game.title}`);
}
const tlou = games.find(game => game.title === "The Last of Us Part I");
if (tlou) {
  for (const genre of ["Action", "Adventure", "Horror", "Survival", "Shooter"]) {
    assert.ok(tlou.genres.includes(genre), `The Last of Us Part I harus memiliki genre ${genre}`);
  }
}
for (const title of ["The Elder Scrolls Online", "Guild Wars 2", "Final Fantasy XIV Online", "Black Desert", "Lost Ark", "Warframe"]) {
  const game = games.find(item => item.title === title);
  assert.ok(game && game.genres.includes("MMO"), `${title} seharusnya memiliki genre MMO`);
}
console.log(`OK: ${games.length} game unik, ${genres.size} genre, dan semua pemeriksaan katalog lulus.`);
