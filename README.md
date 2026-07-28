# 🎵 Sonora

Um clone funcional de player de música estilo **Spotify**, construído com **HTML, CSS e JavaScript puro** (sem frameworks, sem build step). Roda direto no navegador e pode ser publicado gratuitamente no **GitHub Pages**.

![status](https://img.shields.io/badge/status-pronto-3DD68C)
![license](https://img.shields.io/badge/licença-MIT-blue)

## ✨ Funcionalidades

- Layout em 3 áreas: barra lateral, conteúdo principal e barra de reprodução (igual ao Spotify)
- Tela inicial com faixas recentes, "Feito para você" e playlists em destaque
- Página de playlist com lista de faixas numeradas
- Player completo: tocar/pausar, próxima/anterior, aleatório, repetir
- Barra de progresso arrastável com tempo atual/total
- Controle de volume
- Curtir faixas (♡ → ♥), salvo no `localStorage` do navegador
- Busca em tempo real por faixas e playlists
- Saudação dinâmica (Bom dia / Boa tarde / Boa noite)
- Totalmente responsivo (adaptado para celular)
- Capas de álbum geradas via CSS (sem depender de imagens externas)

> ⚠️ **Sobre o áudio**: as faixas usam arquivos de demonstração públicos ([SoundHelix](https://www.soundhelix.com/audio-examples)) só para você testar a reprodução. Os nomes de artistas e músicas são fictícios. Troque pelos seus próprios arquivos/catálogo — veja a seção [Como trocar o conteúdo](#-como-trocar-o-conteúdo-por-faixas-reais).

## 📁 Estrutura do projeto

```
sonora/
├── index.html          # Estrutura da página (sidebar, main, player bar)
├── css/
│   └── style.css       # Todo o visual do app (tema escuro)
├── js/
│   ├── data.js          # Dados mockados: faixas e playlists
│   └── app.js           # Lógica: player, navegação, busca, likes
└── README.md
```

## 🚀 Como rodar localmente

Não precisa instalar nada. Duas opções:

**Opção 1 — abrir direto**
Dê duplo clique no arquivo `index.html` e ele abre no navegador.

**Opção 2 — servidor local (recomendado)**
Alguns navegadores bloqueiam certos recursos ao abrir `file://` diretamente. Para evitar isso, sirva a pasta com um servidor simples:

```bash
# Python 3
python3 -m http.server 8080

# ou, se tiver Node instalado
npx serve .
```

Depois acesse `http://localhost:8080` no navegador.

## ☁️ Como subir para o GitHub

### 1. Crie o repositório

No GitHub, clique em **New repository**, escolha um nome (ex: `sonora-music-app`) e crie **sem** adicionar README (já temos um).

### 2. Suba o projeto pelo terminal

Dentro da pasta do projeto, rode:

```bash
git init
git add .
git commit -m "Primeiro commit: app Sonora"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/sonora-music-app.git
git push -u origin main
```

Troque `SEU-USUARIO` e `sonora-music-app` pelos valores reais do seu repositório.

### 3. (Opcional) Publique gratuitamente com GitHub Pages

1. No repositório, vá em **Settings → Pages**.
2. Em **Source**, selecione a branch `main` e a pasta `/ (root)`.
3. Clique em **Save**.
4. Em alguns minutos, o app estará disponível em:
   `https://SEU-USUARIO.github.io/sonora-music-app/`

## 🎨 Como trocar o conteúdo por faixas reais

Edite `js/data.js`:

```js
const TRACKS = [
  { id: "t1", title: "Nome da faixa", artist: "Nome do artista", src: "URL_OU_CAMINHO_DO_MP3" },
  // ...
];

const PLAYLISTS = [
  { id: "p1", name: "Nome da playlist", description: "Descrição", trackIds: ["t1", "t2"] },
  // ...
];
```

- `src` pode ser uma URL pública ou um arquivo local (ex: `audio/minha-musica.mp3`, colocado em uma pasta `audio/` na raiz do projeto).
- As capas são geradas automaticamente por gradientes de CSS a partir do título da faixa/playlist (função `gradFor` em `data.js`). Se quiser usar imagens reais de capa, adicione um campo `coverImage` nos objetos e ajuste o CSS/JS para usar `background-image` no lugar do gradiente.
- **Atenção a direitos autorais**: se for publicar o projeto publicamente, use apenas áudios e imagens de capa que você tem direito de usar (músicas próprias, com licença, ou de bancos livres).

## 🛠️ Tecnologias

- HTML5 (elemento `<audio>` nativo para reprodução)
- CSS3 (grid, gradientes, variáveis CSS)
- JavaScript (Vanilla, ES6+)
- `localStorage` para persistir curtidas no navegador

## 📌 Possíveis melhorias futuras

- Autenticação de usuários e catálogo real via backend/API
- Upload de músicas próprias
- Criação de playlists personalizadas pelo usuário (o botão "＋" já existe na sidebar como ponto de partida)
- Modo "fila de reprodução" visível e reordenável
- PWA (instalar como app / funcionar offline)

## 📄 Licença

Este projeto está sob a licença MIT — veja o arquivo [LICENSE](LICENSE). Este é um projeto educacional/pessoal inspirado na interface do Spotify; não possui vínculo, afiliação ou aprovação da Spotify AB.
