const searchInput = document.getElementById("searchInput");
const catalog = document.getElementById("catalog");

/* ===============================
   CONTROLE DE TELA
   =============================== */
let telaAtual = null; // "ano" | "top" | null

/* ===============================
   FILTROS
   =============================== */
let selectedGenres = [];

/* ELEMENTOS FILTROS ATIVOS */
const activeFilters = document.getElementById("active-filters");
const filtersList = document.getElementById("filters-list");
const clearFiltersBtn = document.getElementById("clear-filters");

/* MAPA DE GÊNEROS */
const genreMap = {
  acao: 1,
  aventura: 2,
  comedia: 4,
  drama: 8,
  fantasia: 10,
  musica: 19,
  romance: 22,
  "ficcao-cientifica": 24,
  shoujo: 25,
  shounen: 27,
  esportes: 30,
  "slice-of-life": 36,
  sobrenatural: 37,
  seinen: 42,
  suspense: 41
};

/* ===============================
   MODAL FILTROS
   =============================== */
const btnFiltros = document.getElementById("btn-filtros");
const modalFiltros = document.getElementById("modal-filtros");
const genreButtons = document.querySelectorAll(".genres button");

btnFiltros.addEventListener("click", () => {
  modalFiltros.style.display = "flex";
});

genreButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const genero = btn.dataset.genre;

    if (selectedGenres.includes(genero)) {
      selectedGenres = selectedGenres.filter(g => g !== genero);
      btn.classList.remove("ativo");
    } else {
      selectedGenres.push(genero);
      btn.classList.add("ativo");
    }

    atualizarFiltrosAtivos();
  });
});

/* ===============================
   FILTROS ATIVOS (UI)
   =============================== */
function atualizarFiltrosAtivos() {
  if (!selectedGenres.length) {
    activeFilters.style.display = "none";
    filtersList.innerHTML = "";
    return;
  }

  activeFilters.style.display = "flex";
  filtersList.innerHTML = selectedGenres
    .map(g => g.replace("-", " "))
    .join(", ");
}

clearFiltersBtn.addEventListener("click", () => {
  selectedGenres = [];
  genreButtons.forEach(btn => btn.classList.remove("ativo"));
  atualizarFiltrosAtivos();
  buscarAnimes();
});

/* ===============================
   BUSCA (ENTER + FILTROS)
   =============================== */
searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") buscarAnimes();
});

document.getElementById("aplicar-filtros").addEventListener("click", () => {
  modalFiltros.style.display = "none";
  atualizarFiltrosAtivos();
  buscarAnimes();
});

async function buscarAnimes() {
  const termo = searchInput.value.trim();

  if (!termo && !selectedGenres.length) {
    catalog.innerHTML =
      "<p style='color:white'>Digite algo ou selecione um gênero.</p>";
    return;
  }

  try {
    await fetch("http://127.0.0.1:5000/log-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        term: termo,
        genres: selectedGenres
      })
    });
  } catch (err) {
    console.warn("Falha ao registrar busca:", err);
  }

  catalog.innerHTML = "<p style='color:white'>Carregando...</p>";

  const genreIds = selectedGenres
    .map(g => genreMap[g])
    .filter(Boolean)
    .join(",");

  let url = `https://api.jikan.moe/v4/anime?limit=14&sfw=true`;
  if (termo) url += `&q=${encodeURIComponent(termo)}`;
  if (genreIds) url += `&genres=${genreIds}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    renderizarResultados(data.data || []);
  } catch (err) {
    catalog.innerHTML =
      "<p style='color:white'>Erro ao buscar animes.</p>";
    console.error(err);
  }
}

function renderizarResultados(animes) {
  catalog.innerHTML = "";

  if (!animes.length) {
    catalog.innerHTML =
      "<p style='color:white'>Nenhum resultado encontrado.</p>";
    catalog.scrollIntoView({ behavior: "smooth" });
    return;
  }

  animes.forEach(anime => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${anime.images.jpg.image_url}">
      <h3>${anime.title}</h3>
    `;
    card.onclick = () => abrirDetalhes(anime);
    catalog.appendChild(card);
  });

  catalog.scrollIntoView({ behavior: "smooth" });
}

/* ===============================
   MODAL DETALHES
   =============================== */
const modalDetalhes = document.getElementById("modal-detalhes");
const fecharDetalhes = document.getElementById("fechar-detalhes");

function abrirDetalhes(anime) {
  document.getElementById("detalhe-titulo").textContent = anime.title;

  document.getElementById("detalhe-texto").innerHTML =
    anime.synopsis || "Sinopse não disponível.";

  document.getElementById("detalhe-imagem").src =
    anime.images.jpg.image_url;

  document.getElementById("detalhe-score").textContent =
    `⭐ Nota: ${anime.score ?? "N/A"}`;

  document.getElementById("detalhe-status").textContent =
    `📺 Status: ${anime.status ?? "N/A"}`;

  document.getElementById("detalhe-episodios").textContent =
    `🎞️ Episódios: ${anime.episodes ?? "N/A"}`;

  modalDetalhes.style.display = "flex";
}


fecharDetalhes.onclick = () => {
  modalDetalhes.style.display = "none";
};

/* ===============================
   TOP ANIMES
   =============================== */
const btnTopAnimes = document.getElementById("btn-top-animes");
const modalAno = document.getElementById("modal-ano");
const modalTop = document.getElementById("modal-top");

btnTopAnimes.onclick = () => {
  modalAno.style.display = "flex";
  modalTop.style.display = "none";
  telaAtual = "ano";

  const lista = document.getElementById("lista-anos");
  lista.innerHTML = "";

  for (let ano = 2025; ano >= 2012; ano--) {
    const btn = document.createElement("button");
    btn.textContent = ano;
    btn.onclick = () => carregarTopAnimes(ano);
    lista.appendChild(btn);
  }

  setTimeout(() => {
    carregarGraficoAnosMaisPopulares();
  }, 100);
};

/* ===============================
   GRÁFICOS TOP ANIMES
   =============================== */
let graficoTop5 = null;
let graficoGeneros = null;

async function carregarTopAnimes(ano) {
  modalAno.style.display = "none";
  modalTop.style.display = "flex";
  telaAtual = "top";

  document.getElementById("titulo-top").textContent =
    `Top Animes de ${ano}`;

  const res = await fetch(
    `https://api.jikan.moe/v4/anime?start_date=${ano}-01-01&end_date=${ano}-12-31&order_by=members&sort=desc&limit=5`
  );
  const data = await res.json();
  const animes = data.data || [];

  const canvasTop = document.getElementById("graficoTop5");

  if (canvasTop && window.Chart) {
    if (graficoTop5) graficoTop5.destroy();

    graficoTop5 = new Chart(canvasTop, {
      type: "bar",
      data: {
        labels: animes.map(a => a.title),
        datasets: [{
          label: "Popularidade (members)",
          data: animes.map(a => a.members)
        }]
      }
    });
  }

  const canvasGen = document.getElementById("graficoGeneros");

  if (canvasGen && window.Chart) {
    const contadorGeneros = {};

    animes.forEach(anime => {
      anime.genres.forEach(g => {
        contadorGeneros[g.name] =
          (contadorGeneros[g.name] || 0) + 1;
      });
    });

    const generosOrdenados = Object.entries(contadorGeneros)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    if (graficoGeneros) graficoGeneros.destroy();

    graficoGeneros = new Chart(canvasGen, {
      type: "pie",
      data: {
        labels: generosOrdenados.map(g => g[0]),
        datasets: [{
          data: generosOrdenados.map(g => g[1])
        }]
      }
    });
  }
}

/* ===============================
   BOTÃO VOLTAR
   =============================== */
function voltar() {
  if (telaAtual === "top") {
    modalTop.style.display = "none";
    modalAno.style.display = "flex";
    telaAtual = "ano";
  } else if (telaAtual === "ano") {
    modalAno.style.display = "none";
    telaAtual = null;
  }
}

/* ===============================
   GRÁFICO ANOS MAIS PROCURADOS
   =============================== */
let graficoAnosChart = null;

async function carregarGraficoAnosMaisPopulares() {
  const cacheKey = "topAnosMaisProcurados";
  const cache = localStorage.getItem(cacheKey);

  if (cache) {
    desenharGraficoAnos(JSON.parse(cache));
    return;
  }

  const resultados = [];

  for (let ano = 2016; ano <= 2025; ano++) {
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?start_date=${ano}-01-01&end_date=${ano}-12-31&order_by=members&sort=desc&limit=25`
    );
    const data = await res.json();

    const soma = (data.data || [])
      .reduce((acc, a) => acc + (a.members || 0), 0);

    resultados.push({ ano, total: soma });
  }

  resultados.sort((a, b) => b.total - a.total);
  const top5 = resultados.slice(0, 5);

  localStorage.setItem(cacheKey, JSON.stringify(top5));
  desenharGraficoAnos(top5);
}

function desenharGraficoAnos(dados) {
  const ctx = document.getElementById("graficoAnos");
  if (!ctx) return;

  if (graficoAnosChart) graficoAnosChart.destroy();

  graficoAnosChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: dados.map(d => d.ano),
      datasets: [{
        label: "Procura total (members)",
        data: dados.map(d => d.total)
      
        }]
      }
    });
  }
