const searchInput = document.getElementById("searchInput");
const catalog = document.getElementById("catalog");

/* MAPA DE GÊNEROS */
const genreMap = {
  "acao": 1,
  "aventura": 2,
  "comedia": 4,
  "drama": 8,
  "fantasia": 10,
  "musica": 19,
  "romance": 22,
  "ficcao-cientifica": 24,
  "shoujo": 25,
  "shounen": 27,
  "esportes": 30,
  "slice-of-life": 36,
  "sobrenatural": 37,
  "seinen": 42,
  "suspense": 41
};

/* BUSCA */
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") buscarAnimes();
});

async function buscarAnimes() {
  const termo = searchInput.value.trim();

  if (!termo && selectedGenres.length === 0) return;

  catalog.innerHTML = "<p style='color:white'>Carregando...</p>";

  const genreIds = selectedGenres
    .map(g => genreMap[g])
    .filter(Boolean)
    .join(",");

  let url = `https://api.jikan.moe/v4/anime?limit=14&sfw=true`;
  if (termo) url += `&q=${encodeURIComponent(termo)}`;
  if (genreIds) url += `&genres=${genreIds}`;

  const response = await fetch(url);
  const data = await response.json();
  renderizarResultados(data.data);
}

function renderizarResultados(animes) {
  catalog.innerHTML = "";

  animes.forEach(anime => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${anime.images.jpg.image_url}">
      <h3>${anime.title}</h3>
    `;

    card.addEventListener("click", () => abrirDetalhes(anime));
    catalog.appendChild(card);
  });

  catalog.scrollIntoView({ behavior: "smooth" });
}

/* BOTÃO TOPO */
const btnTopo = document.getElementById("btn-topo");

window.addEventListener("scroll", () => {
  btnTopo.style.display = window.scrollY > 300 ? "block" : "none";
});

btnTopo.addEventListener("click", () => {
  document.getElementById("hero").scrollIntoView({ behavior: "smooth" });
});

/* MODAL DETALHES */
const modalDetalhes = document.getElementById("modal-detalhes");
const fecharDetalhes = document.getElementById("fechar-detalhes");
const detalheTitulo = document.getElementById("detalhe-titulo");
const detalheTexto = document.getElementById("detalhe-texto");
const detalheImagem = document.getElementById("detalhe-imagem");

function abrirDetalhes(anime) {
  detalheTitulo.textContent = anime.title;

  detalheTexto.innerHTML = `
    <p><strong>Tipo:</strong> ${anime.type || "N/A"}</p>
    <p><strong>Episódios:</strong> ${anime.episodes || "N/A"}</p>
    <p><strong>Status:</strong> ${anime.status || "N/A"}</p>
    <p><strong>Score:</strong> ${anime.score || "N/A"}</p>
    <p><strong>Sinopse:</strong><br>${anime.synopsis || "Sem descrição."}</p>
  `;

  detalheImagem.src = anime.images.jpg.image_url;
  modalDetalhes.style.display = "flex";
}

fecharDetalhes.addEventListener("click", () => {
  modalDetalhes.style.display = "none";
});

modalDetalhes.addEventListener("click", (e) => {
  if (e.target === modalDetalhes) modalDetalhes.style.display = "none";
});
