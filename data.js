/* ==========================================================
   Sonora — dados de exemplo
   As faixas usam áudios de demonstração livres (SoundHelix),
   e as capas são geradas via CSS (gradientes), sem depender
   de imagens externas protegidas por direitos autorais.
   Troque isso pelo seu backend/catálogo real quando quiser.
   ========================================================== */

const GRADIENTS = [
  "linear-gradient(135deg,#5c5c5c,#0a0a0a)",
  "linear-gradient(135deg,#7a7a7a,#1a1a1a)",
  "linear-gradient(135deg,#4a4a4a,#000000)",
  "linear-gradient(135deg,#8c8c8c,#232323)",
  "linear-gradient(135deg,#3a3a3a,#111111)",
  "linear-gradient(135deg,#6e6e6e,#050505)",
  "linear-gradient(135deg,#9a9a9a,#2c2c2c)",
  "linear-gradient(135deg,#525252,#0d0d0d)",
];

function gradFor(seed) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}

const SOUND_SRC = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
];

const TRACKS = [
  { id: "t1", title: "Luz de Neon",        artist: "Rio Costa",       src: SOUND_SRC[0] },
  { id: "t2", title: "Maré Alta",          artist: "Bruma",          src: SOUND_SRC[1] },
  { id: "t3", title: "Café das 6",         artist: "Nando Villa",    src: SOUND_SRC[2] },
  { id: "t4", title: "Asfalto Quente",     artist: "Zona Sul Trio",  src: SOUND_SRC[3] },
  { id: "t5", title: "Deriva",             artist: "Lua Cheia",      src: SOUND_SRC[4] },
  { id: "t6", title: "Sertão Elétrico",    artist: "Cordel Digital", src: SOUND_SRC[5] },
  { id: "t7", title: "Vento Norte",        artist: "Bruma",          src: SOUND_SRC[6] },
  { id: "t8", title: "Onda Curta",         artist: "Rio Costa",      src: SOUND_SRC[7] },
  { id: "t9", title: "Concreto e Flor",    artist: "Nando Villa",    src: SOUND_SRC[0] },
  { id: "t10", title: "Madrugada 3:14",    artist: "Zona Sul Trio",  src: SOUND_SRC[1] },
  { id: "t11", title: "Sinal Fraco",       artist: "Cordel Digital", src: SOUND_SRC[2] },
  { id: "t12", title: "Horizonte",         artist: "Lua Cheia",      src: SOUND_SRC[3] },
].map(t => ({ ...t, cover: gradFor(t.title) }));

function trackById(id) {
  return TRACKS.find(t => t.id === id);
}

const PLAYLISTS = [
  {
    id: "p1",
    name: "Rap Nacional Essencial",
    description: "As batidas que tocam nas ruas.",
    trackIds: ["t1", "t4", "t6", "t9", "t11"],
  },
  {
    id: "p2",
    name: "Foco Total",
    description: "Instrumentais para concentrar e produzir.",
    trackIds: ["t2", "t5", "t7", "t12"],
  },
  {
    id: "p3",
    name: "Domingo de Sol",
    description: "Leveza para curtir o dia de folga.",
    trackIds: ["t3", "t8", "t10", "t1"],
  },
  {
    id: "p4",
    name: "Modo Noturno",
    description: "Sons mais introspectivos para a madrugada.",
    trackIds: ["t5", "t7", "t11", "t2"],
  },
  {
    id: "p5",
    name: "Descobertas da Semana",
    description: "Artistas e faixas selecionados para você.",
    trackIds: ["t9", "t10", "t12", "t6"],
  },
  {
    id: "p6",
    name: "Clássicos Sonora",
    description: "Os favoritos de sempre.",
    trackIds: ["t1", "t2", "t3", "t4", "t5", "t6"],
  },
];

function playlistById(id) {
  return PLAYLISTS.find(p => p.id === id);
}
