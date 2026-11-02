let games = [];
let wishlist = new Set();
let activeGenre = "All";
let currentGame = null;
const $ = id => document.getElementById(id);
let allGenres = [];
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),2100)}
function escapeHTML(value){return String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));}
function card(game){
 const title=escapeHTML(game.title), image=escapeHTML(game.image), age=escapeHTML(game.ageRating||"NR");
 const genres=(game.genres||[game.genre]).slice(0,4).map(escapeHTML).join(" · ");
 const saved=wishlist.has(game.id);
 return `<article class="game-card"><div class="game-art" role="button" tabindex="0" aria-label="Lihat detail ${title}" data-details="${title}" style="background-image:url('${image}')"><span class="age-badge" title="Rating usia referensi ESRB">${age}</span><button class="heart ${saved?"saved":""}" data-wish="${game.id}" aria-label="${saved?"Hapus":"Tambah"} ${title} ${saved?"dari":"ke"} wishlist">${saved?"♥":"♡"}</button></div><div class="card-info"><h3 class="card-title" data-details="${title}">${title}</h3><div class="meta">${genres} · ${escapeHTML(game.platforms?.[0]||"Platform tidak diketahui")}</div><div class="rating">★ ${Number(game.rating||0).toFixed(1)} <span class="age-inline">· ${age}</span></div></div></article>`;
}
function populateGenreControls(){
 const select=$("genreFilter");
 if(select){const selected=select.value||"All";select.innerHTML='<option value="All">All genres</option>'+allGenres.map(g=>`<option value="${g}">${g}</option>`).join("");select.value=allGenres.includes(selected)?selected:"All";}
 const chips=$("genreChips");
 if(chips){const order=['All','Action','Adventure','RPG','Shooter','Horror','Survival','Strategy','Simulation','Racing','Sports','Puzzle','Sandbox','Platformer','Fighting','Roguelike','Casual','Indie','Visual Novel','Stealth','Open World'];const ordered=[...order.filter(g=>g==='All'||allGenres.includes(g)),...allGenres.filter(g=>!order.includes(g))];chips.innerHTML=ordered.map(g=>`<button class="chip ${g==='All'?'selected':''}" data-genre="${g}">${g==='All'?'All':g}</button>`).join("");}
 const genreGrid=document.querySelector("#genres .genre-grid");
 if(genreGrid){const icons={Action:'⚔️',Adventure:'🧭',RPG:'🧙',Shooter:'🎯',Horror:'🌑',Survival:'🏕️',Strategy:'♟️',Simulation:'🏙️',Racing:'🏎️',Sports:'🏆',Puzzle:'🧩',Sandbox:'🧱',Platformer:'🦘',Fighting:'🥊',Roguelike:'🔁',Casual:'🎈',Indie:'💎','Visual Novel':'📖',Stealth:'🥷','Open World':'🌍'};genreGrid.innerHTML=allGenres.map(g=>`<button class="genre-card" data-genre="${g}"><span>${icons[g]||'🎮'}</span><strong>${g}</strong><small>${games.filter(game=>(game.genres||[game.genre]).includes(g)).length} games</small></button>`).join("");}
}
function renderPopular(){$("popularGrid").innerHTML=[...games].sort((a,b)=>b.rating-a.rating).slice(0,5).map(card).join("")}
function renderExplore(){const q=$("exploreSearch").value.trim().toLowerCase();const genre=$("genreFilter").value;const platform=$("platformFilter").value;const sort=$("sortFilter").value;let filtered=games.filter(g=>((activeGenre==="All"||(g.genres||[g.genre]).includes(activeGenre))&&(genre==="All"||(g.genres||[g.genre]).includes(genre))&&(platform==="All"||g.platforms.includes(platform))&&(`${g.title} ${(g.genres||[g.genre]).join(" ")} ${(g.tags||[]).join(" ")}`).toLowerCase().includes(q)));if(sort==="rating")filtered.sort((a,b)=>b.rating-a.rating);if(sort==="az")filtered.sort((a,b)=>a.title.localeCompare(b.title));$("exploreGrid").innerHTML=filtered.map(card).join("");$("resultCount").textContent=`Menampilkan ${filtered.length} dari ${games.length} game`;$("emptyState").classList.toggle("hidden",filtered.length>0);document.querySelectorAll(".chip").forEach(c=>c.classList.toggle("selected",c.dataset.genre===activeGenre))}
function renderWishlist(){$("wishlistGrid").innerHTML=games.filter(g=>wishlist.has(g.id)).map(card).join("");$("wishlistEmpty").classList.toggle("hidden",wishlist.size>0);$("wishCount").textContent=wishlist.size}
async function toggleWish(id){
 id=Number(id);
 const shouldSave=!wishlist.has(id);
 try {
  await GameVaultDB.setWishlisted(id,shouldSave);
  if(shouldSave){wishlist.add(id);toast("Game ditambahkan ke wishlist")}else{wishlist.delete(id);toast("Game dihapus dari wishlist")}
 } catch(error) { console.error("Wishlist database error:",error); toast("Wishlist gagal disimpan. Coba muat ulang halaman."); return; }
 renderPopular();renderExplore();renderWishlist();if(currentGame&&currentGame.id===id)updateDetailWish();
}
function showPage(page){document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));const target=$(page);if(target)target.classList.add("active");document.querySelectorAll(".nav-link").forEach(a=>a.classList.toggle("active",a.dataset.page===page));$("nav").classList.remove("open");if(page==="explore")renderExplore();if(page==="wishlist")renderWishlist();window.scrollTo({top:0,behavior:"smooth"})}
function openDetails(title){currentGame=games.find(g=>g.title===title)||games[0];if(!currentGame)return;$("detailTitle").textContent=currentGame.title;$("detailRating").textContent=currentGame.rating.toFixed(1);$("detailDescription").textContent=currentGame.description;$("detailAbout").textContent=currentGame.description+" Data katalog ini merupakan ringkasan frontend; rating usia resmi dapat berbeda menurut wilayah dan edisi game.";$("detailTags").innerHTML=[...(currentGame.genres||[currentGame.genre]),...(currentGame.tags||[]),`Usia: ${currentGame.ageRating}`].map(t=>`<span class="tag">${escapeHTML(t)}</span>`).join("");$("detailPlatforms").innerHTML=currentGame.platforms.map(p=>`<span>▣ ${p}</span>`).join("");$("detailRelease").textContent="Release Date: "+currentGame.release;$("detailGenre").textContent=(currentGame.genres||[currentGame.genre]).join(", ");$("detailPlatformText").textContent=currentGame.platforms.join(", ");$("detailReleaseText").textContent=currentGame.release;$("detailCover").style.backgroundImage=`url('${currentGame.image}')`;updateDetailWish();showPage("details")}
function updateDetailWish(){if(!currentGame)return;$("detailWish").innerHTML=wishlist.has(currentGame.id)?"♥ Added to Wishlist":"♡ Add to Wishlist";$("detailWish").style.background=wishlist.has(currentGame.id)?"#263442":""}
document.addEventListener("keydown",e=>{const d=e.target.closest?.('[data-details][role="button"]');if(d&&(e.key==="Enter"||e.key===" ")){e.preventDefault();openDetails(d.dataset.details)}});
document.addEventListener("click",e=>{const w=e.target.closest("[data-wish]");if(w){e.preventDefault();e.stopPropagation();toggleWish(w.dataset.wish);return}const d=e.target.closest("[data-details]");if(d){openDetails(d.dataset.details);return}const go=e.target.closest("[data-go]");if(go){showPage(go.dataset.go);return}const g=e.target.closest("[data-genre]");if(g){activeGenre=g.dataset.genre;$("genreFilter").value=activeGenre;showPage("explore");renderExplore();return}const nav=e.target.closest(".nav-link");if(nav){e.preventDefault();showPage(nav.dataset.page)}});
document.querySelectorAll(".nav-link").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();showPage(a.dataset.page);location.hash=a.dataset.page}));
function runGlobalSearch(){const field=$("globalSearch");$("exploreSearch").value=field.value;activeGenre="All";$("genreFilter").value="All";showPage("explore");renderExplore()}
$("globalSearch").addEventListener("keydown",e=>{if(e.key==="Enter")runGlobalSearch()});
$("exploreSearch").addEventListener("input",renderExplore);$("genreFilter").addEventListener("change",()=>{activeGenre="All";renderExplore()});$("platformFilter").addEventListener("change",renderExplore);$("sortFilter").addEventListener("change",renderExplore);
$("genreChips").addEventListener("click",e=>{const c=e.target.closest("[data-genre]");if(c){activeGenre=c.dataset.genre;$("genreFilter").value=activeGenre;renderExplore()}});
$("detailWish").addEventListener("click",()=>{if(currentGame)toggleWish(currentGame.id)});$("backExplore").addEventListener("click",()=>showPage("explore"));$("menuToggle").addEventListener("click",()=>$("nav").classList.toggle("open"));
window.addEventListener("hashchange",()=>{const p=location.hash.slice(1);if($(p)&&$(p).classList.contains("page"))showPage(p)});
async function initGameVault(){
 try {
   const response=await fetch("data/games.json",{cache:"no-cache"});
   if(!response.ok)throw new Error(`HTTP ${response.status}`);
   const data=await response.json();
   if(!Array.isArray(data)||!data.length)throw new Error("Katalog kosong atau format tidak valid");
   games=await GameVaultDB.seedGames(data);
   games.sort((a,b)=>Number(a.id)-Number(b.id));
   wishlist=new Set(await GameVaultDB.getWishlistIds());
   allGenres=[...new Set(games.flatMap(g=>g.genres||[g.genre]))].sort((a,b)=>a.localeCompare(b));
   currentGame=games[0];
   const validIds=new Set(games.map(g=>Number(g.id)));
   wishlist=new Set([...wishlist].filter(id=>validIds.has(Number(id))));
   populateGenreControls();renderPopular();renderExplore();renderWishlist();
   const page=location.hash.slice(1);
   if(page&&$(page)&&$(page).classList.contains("page"))showPage(page);
 } catch(error) {
   console.error("GameVault gagal memuat katalog:",error);
   const main=document.querySelector("main");
   main.innerHTML='<section class="empty-state"><h2>Katalog belum dapat dimuat</h2><p>Jalankan website melalui server lokal (npm run dev atau npm run dev:python), bukan dengan membuka file HTML langsung.</p><p>Pastikan file data/games.json tersedia.</p></section>';
 }
}
initGameVault();
