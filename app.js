/* ==========================================================
   Sonora — lógica do app
   ========================================================== */

const audio = document.getElementById("audio");
const state = {
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  shuffle: false,
  repeat: false, // repete a fila inteira quando chega ao fim
  liked: new Set(JSON.parse(localStorage.getItem("sonora_liked") || "[]")),
};

function saveLiked() {
  localStorage.setItem("sonora_liked", JSON.stringify([...state.liked]));
}

function fmtTime(sec) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/* ---------- Renderização das listas iniciais ---------- */

function renderPlaylistSidebar() {
  const ul = document.getElementById("playlist-list");
  ul.innerHTML = "";
  PLAYLISTS.forEach(pl => {
    const li = document.createElement("li");
    li.textContent = pl.name;
    li.dataset.id = pl.id;
    li.addEventListener("click", () => openPlaylist(pl.id));
    ul.appendChild(li);
  });
}

function renderRecent() {
  const grid = document.getElementById("recent-grid");
  grid.innerHTML = "";
  TRACKS.slice(0, 6).forEach(t => {
    const div = document.createElement("div");
    div.className = "quick-card";
    div.innerHTML = `
      <div class="thumb" style="background:${t.cover}">♪</div>
      <span class="name">${t.title}</span>
    `;
    div.addEventListener("click", () => playQueue(TRACKS.map(x => x.id), TRACKS.findIndex(x => x.id === t.id)));
    grid.appendChild(div);
  });
}

function playlistCardHTML(pl) {
  return `
    <div class="cover" style="background:${gradFor(pl.name)}">♫</div>
    <div class="pl-name">${pl.name}</div>
    <div class="pl-sub">${pl.description}</div>
    <button class="play-fab" title="Tocar ${pl.name}">▶</button>
  `;
}

function renderCardRow(containerId, playlists) {
  const row = document.getElementById(containerId);
  row.innerHTML = "";
  playlists.forEach(pl => {
    const card = document.createElement("div");
    card.className = "pl-card";
    card.innerHTML = playlistCardHTML(pl);
    card.addEventListener("click", (e) => {
      if (e.target.closest(".play-fab")) {
        playQueue(pl.trackIds, 0);
      } else {
        openPlaylist(pl.id);
      }
    });
    row.appendChild(card);
  });
}

function renderHome() {
  renderRecent();
  renderCardRow("made-for-you", PLAYLISTS.slice(0, 4));
  renderCardRow("featured-row", PLAYLISTS);
}

function setGreeting() {
  const h = new Date().getHours();
  let g = "Boa noite";
  if (h >= 5 && h < 12) g = "Bom dia";
  else if (h >= 12 && h < 18) g = "Boa tarde";
  document.getElementById("greeting").textContent = g;
}

/* ---------- Navegação entre views ---------- */

function showView(name) {
  document.querySelectorAll(".view").forEach(v => v.classList.add("hidden"));
  document.getElementById(`view-${name}`).classList.remove("hidden");
  document.querySelectorAll(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.view === name));
}

document.querySelectorAll(".nav-item").forEach(btn => {
  btn.addEventListener("click", () => showView(btn.dataset.view));
});

function openPlaylist(id) {
  const pl = playlistById(id);
  if (!pl) return;
  document.getElementById("pl-title").textContent = pl.name;
  document.getElementById("pl-desc").textContent = pl.description;
  document.getElementById("pl-count").textContent = `${pl.trackIds.length} faixas`;
  document.getElementById("pl-cover").style.background = gradFor(pl.name);

  document.querySelectorAll(".playlist-list li").forEach(li => li.classList.toggle("active", li.dataset.id === id));

  const table = document.getElementById("pl-tracks");
  table.innerHTML = "";
  pl.trackIds.forEach((tid, i) => {
    const t = trackById(tid);
    const row = document.createElement("div");
    row.className = "track-row";
    row.dataset.trackId = tid;
    row.innerHTML = `
      <span class="idx">${i + 1}</span>
      <div>
        <div class="t-title">${t.title}</div>
        <div class="t-artist">${t.artist}</div>
      </div>
      <span class="t-like ${state.liked.has(tid) ? "liked" : ""}">${state.liked.has(tid) ? "♥" : "♡"}</span>
    `;
    row.addEventListener("click", (e) => {
      if (e.target.classList.contains("t-like")) {
        toggleLike(tid, e.target);
      } else {
        playQueue(pl.trackIds, i);
      }
    });
    table.appendChild(row);
  });

  document.getElementById("view-home").classList.add("hidden");
  document.getElementById("view-search").classList.add("hidden");
  document.getElementById("view-playlist").classList.remove("hidden");
}

function toggleLike(trackId, el) {
  if (state.liked.has(trackId)) {
    state.liked.delete(trackId);
  } else {
    state.liked.add(trackId);
  }
  saveLiked();
  document.querySelectorAll(`[data-track-id="${trackId}"] .t-like`).forEach(span => {
    span.classList.toggle("liked", state.liked.has(trackId));
    span.textContent = state.liked.has(trackId) ? "♥" : "♡";
  });
  updateLikeButton();
}

/* ---------- Busca ---------- */

const searchInput = document.getElementById("search-input");
searchInput.addEventListener("focus", () => showView("search"));
searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  const results = document.getElementById("search-results");
  results.innerHTML = "";
  if (!q) return;
  const matches = PLAYLISTS.filter(p => p.name.toLowerCase().includes(q));
  const trackMatches = TRACKS.filter(t => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q));

  matches.forEach(pl => {
    const card = document.createElement("div");
    card.className = "pl-card";
    card.innerHTML = playlistCardHTML(pl);
    card.addEventListener("click", (e) => {
      if (e.target.closest(".play-fab")) playQueue(pl.trackIds, 0);
      else openPlaylist(pl.id);
    });
    results.appendChild(card);
  });

  trackMatches.forEach(t => {
    const card = document.createElement("div");
    card.className = "pl-card";
    card.innerHTML = `
      <div class="cover" style="background:${t.cover}">♪</div>
      <div class="pl-name">${t.title}</div>
      <div class="pl-sub">${t.artist}</div>
      <button class="play-fab">▶</button>
    `;
    card.addEventListener("click", () => playQueue([t.id], 0));
    results.appendChild(card);
  });
});

/* ---------- Player ---------- */

function playQueue(trackIds, startIndex) {
  state.queue = [...trackIds];
  state.currentIndex = startIndex;
  loadCurrent();
  audio.play();
}

function loadCurrent() {
  const tid = state.queue[state.currentIndex];
  const t = trackById(tid);
  if (!t) return;
  audio.src = t.src;
  document.getElementById("np-title").textContent = t.title;
  document.getElementById("np-artist").textContent = t.artist;
  document.getElementById("np-cover").style.background = t.cover;
  updateLikeButton();
  highlightPlayingRow(tid);
}

function updateLikeButton() {
  const tid = state.queue[state.currentIndex];
  const btn = document.getElementById("btn-like");
  if (!tid) { btn.classList.remove("liked"); btn.textContent = "♡"; return; }
  const liked = state.liked.has(tid);
  btn.classList.toggle("liked", liked);
  btn.textContent = liked ? "♥" : "♡";
}

function highlightPlayingRow(tid) {
  document.querySelectorAll(".track-row").forEach(row => {
    row.classList.toggle("playing", row.dataset.trackId === tid);
  });
}

document.getElementById("btn-like").addEventListener("click", () => {
  const tid = state.queue[state.currentIndex];
  if (tid) toggleLike(tid, null);
});

const btnPlay = document.getElementById("btn-play");
btnPlay.addEventListener("click", () => {
  if (!audio.src) return;
  if (audio.paused) audio.play(); else audio.pause();
});

audio.addEventListener("play", () => { state.isPlaying = true; btnPlay.textContent = "⏸"; });
audio.addEventListener("pause", () => { state.isPlaying = false; btnPlay.textContent = "▶"; });

document.getElementById("btn-next").addEventListener("click", nextTrack);
document.getElementById("btn-prev").addEventListener("click", prevTrack);

function nextTrack() {
  if (!state.queue.length) return;
  if (state.shuffle) {
    state.currentIndex = Math.floor(Math.random() * state.queue.length);
  } else {
    state.currentIndex++;
    if (state.currentIndex >= state.queue.length) {
      if (state.repeat) state.currentIndex = 0;
      else { state.currentIndex = state.queue.length - 1; audio.pause(); return; }
    }
  }
  loadCurrent();
  audio.play();
}

function prevTrack() {
  if (!state.queue.length) return;
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  state.currentIndex = Math.max(0, state.currentIndex - 1);
  loadCurrent();
  audio.play();
}

audio.addEventListener("ended", nextTrack);

const btnShuffle = document.getElementById("btn-shuffle");
btnShuffle.addEventListener("click", () => {
  state.shuffle = !state.shuffle;
  btnShuffle.classList.toggle("active", state.shuffle);
});

const btnRepeat = document.getElementById("btn-repeat");
btnRepeat.addEventListener("click", () => {
  state.repeat = !state.repeat;
  btnRepeat.classList.toggle("active", state.repeat);
});

/* Barra de progresso */
const seek = document.getElementById("seek");
let seeking = false;

audio.addEventListener("timeupdate", () => {
  if (seeking) return;
  const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  seek.value = pct;
  document.getElementById("time-current").textContent = fmtTime(audio.currentTime);
  document.getElementById("time-total").textContent = fmtTime(audio.duration);
});

seek.addEventListener("input", () => { seeking = true; });
seek.addEventListener("change", () => {
  if (audio.duration) audio.currentTime = (seek.value / 100) * audio.duration;
  seeking = false;
});

/* Volume */
const volume = document.getElementById("volume");
audio.volume = volume.value / 100;
volume.addEventListener("input", () => { audio.volume = volume.value / 100; });

/* ---------- Inicialização ---------- */

renderPlaylistSidebar();
renderHome();
setGreeting();
showView("home");
