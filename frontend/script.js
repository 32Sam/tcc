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
    btnInicio.style.display = "block";
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

fecharDetalhes.onclick = () => {
  modalDetalhes.style.display = "none";
};

function abrirDetalhes(anime) {

  document.getElementById("detalhe-titulo").textContent = anime.title;

  document.getElementById("detalhe-texto").innerHTML =
    anime.synopsis || "Sinopse não disponível.";

  document.getElementById("detalhe-imagem").src =
    anime.images.jpg.image_url;

  document.getElementById("detalhe-status").textContent =
    `📺 Status: ${anime.status ?? "N/A"}`;

  document.getElementById("detalhe-episodios").textContent =
    `🎞️ Episódios: ${anime.episodes ?? "N/A"}`;

  /* ===== SCORE BADGE ANIMADA ===== */

  const score = anime.score ?? 0;
  const badge = document.getElementById("scoreBadge");
  const scoreValue = document.getElementById("scoreValue");

  scoreValue.textContent = anime.score ?? "N/A";

  // reset visual
  badge.style.setProperty("--score", 0);

  let current = 0;
  const target = score * 10;

  const interval = setInterval(() => {
    current += 2;

    if (current >= target) {
      current = target;
      clearInterval(interval);
    }

    badge.style.setProperty("--score", current);
  }, 15);

  /* ===== COR DINÂMICA OPCIONAL ===== */

  if (score >= 8) {
    badge.style.boxShadow = "0 0 15px rgba(0,255,150,0.6)";
  } else if (score >= 6) {
    badge.style.boxShadow = "0 0 15px rgba(255,200,0,0.6)";
  } else {
    badge.style.boxShadow = "0 0 15px rgba(255,80,80,0.6)";
  }

  modalDetalhes.style.display = "flex";
}

/* ===============================
   TOP ANIMES
   =============================== */
const btnTopAnimes = document.getElementById("btn-top-animes");
const modalAno = document.getElementById("modal-ano");
const modalTop = document.getElementById("modal-top");

btnTopAnimes.onclick = () => {
  bloquearBotoesMenu(true);
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
      data: animes.map(a => a.members),
      backgroundColor: "#f5c518",
      borderRadius: 6
    }]
  },
  options: {
    plugins: {
      legend: {
        labels: {
          color: "#ffffff"
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: "#ffffff"
        }
      },
      y: {
        ticks: {
          color: "#ffffff"
        }
      }
    }
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

  // CALENDÁRIO (fecha e libera)
  if (telaAtual === "calendario") {
    modalCalendario.style.display = "none";
    telaAtual = null;
    bloquearBotoesMenu(false);
    return;
  }

  // POPULARIDADE (fecha e libera)
  if (telaAtual === "popularidade") {
    modalPopularidade.style.display = "none";
    telaAtual = null;
    bloquearBotoesMenu(false);
    return;
  }

  // TOP (volta para seleção de ano — ainda NÃO libera)
  if (telaAtual === "top") {
    modalTop.style.display = "none";
    modalAno.style.display = "flex";
    telaAtual = "ano";
    return;
  }

  // ANO (fecha ranking anual totalmente e libera)
  if (telaAtual === "ano") {
    modalAno.style.display = "none";
    telaAtual = null;
    bloquearBotoesMenu(false);
    return;
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
      data: dados.map(d => d.total),
      backgroundColor: "#f5c518",
      borderRadius: 6
    }]
  },
  options: {
    plugins: {
      legend: {
        labels: {
          color: "#ffffff"
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: "#ffffff"
        }
      },
      y: {
        ticks: {
          color: "#ffffff"
        }
      }
    }
  }
});
  }

/* ===============================
   POPULARIDADE COMPARATIVA
   =============================== */

const btnPopularidade = document.getElementById("btn-popularidade");
const modalPopularidade = document.getElementById("modal-popularidade");

let graficoMaisBuscados = null;
let graficoMaisBemAvaliados = null;

btnPopularidade.onclick = () => {
  bloquearBotoesMenu(true);
  modalPopularidade.style.display = "flex";
  telaAtual = "popularidade";
  carregarPopularidadeComparativa();
};

async function carregarPopularidadeComparativa() {

  const anoAtual = new Date().getFullYear();
  const anoInicial = anoAtual - 10;

  const res = await fetch(
    `https://api.jikan.moe/v4/anime?start_date=${anoInicial}-01-01&end_date=${anoAtual}-12-31&limit=25`
  );

  const data = await res.json();
  const animes = data.data || [];

  const topBuscados = [...animes]
    .sort((a, b) => b.members - a.members)
    .slice(0, 5);

  if (graficoMaisBuscados) graficoMaisBuscados.destroy();

graficoMaisBuscados = new Chart(
  document.getElementById("graficoMaisBuscados"),
  {
    type: "bar",
    data: {
      labels: topBuscados.map(a => a.title),
      datasets: [{
        label: "Popularidade (members)",
        data: topBuscados.map(a => a.members),
        backgroundColor: "#f5c518",
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#ffffff"
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: "#dddddd"
          },
          grid: {
            color: "rgba(255,255,255,0.05)"
          }
        },
        y: {
          ticks: {
            color: "#dddddd"
          },
          grid: {
            color: "rgba(255,255,255,0.05)"
          }
        }
      }
    }
  }
);

  /* ===== MAIS BEM AVALIADOS (SCORE REAL DA API) ===== */

  const resScore = await fetch(
    `https://api.jikan.moe/v4/anime?order_by=score&sort=desc&limit=5&sfw=true`
  );

  const dataScore = await resScore.json();
  const topScore = dataScore.data || [];

  if (graficoMaisBemAvaliados) graficoMaisBemAvaliados.destroy();

graficoMaisBemAvaliados = new Chart(
  document.getElementById("graficoMaisBemAvaliados"),
  {
    type: "bar",
    data: {
      labels: topScore.map(a => a.title),
      datasets: [{
        label: "Melhor Avaliação (score)",
        data: topScore.map(a => a.score),
        backgroundColor: "#f5c518",
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#ffffff"
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: "#dddddd"
          },
          grid: {
            color: "rgba(255,255,255,0.05)"
          }
        },
        y: {
          ticks: {
            color: "#dddddd"
          },
          grid: {
            color: "rgba(255,255,255,0.05)"
          }
        }
      }
    }
  }
);

}

/* ===============================
   VOLTAR
   =============================== */

function voltar() {

  if (telaAtual === "popularidade") {
    modalPopularidade.style.display = "none";
    telaAtual = null;
  }

  else if (telaAtual === "top") {
    modalTop.style.display = "none";
    modalAno.style.display = "flex";
    telaAtual = "ano";
    return; // aqui não libera ainda
  }

  else if (telaAtual === "ano") {
    modalAno.style.display = "none";
    telaAtual = null;
  }

  bloquearBotoesMenu(false);
}



/* ===============================
   FUNÇÃO PARA CONTROLE DOS BOTÕES PARA NÃO GERAR ERRO DE SOBREPOSIÇÃO)
   =============================== */
function bloquearBotoesMenu(bloquear) {

  const botoes = [btnTopAnimes, btnPopularidade, btnCalendario];

  botoes.forEach(btn => {
    if (!btn) return; // segurança caso algum não exista

    btn.disabled = bloquear;
    btn.style.opacity = bloquear ? "0.5" : "1";
    btn.style.cursor = bloquear ? "not-allowed" : "pointer";
  });

}

/* ===============================
   CALENDÁRIO (ONTEM / HOJE / AMANHÃ)
   =============================== */

const btnCalendario = document.getElementById("btn-calendario");
const modalCalendario = document.getElementById("modal-calendario");

const calTitulo = document.getElementById("cal-titulo");
const calLista = document.getElementById("cal-lista");

const btnCalOntem = document.getElementById("cal-ontem");
const btnCalHoje = document.getElementById("cal-hoje");
const btnCalAmanha = document.getElementById("cal-amanha");

let calOffset = 0; // -1 ontem, 0 hoje, +1 amanhã

const diasEN = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const diasPT = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

function getDiaTarget(offset) {
  const hoje = new Date();
  const idx = (hoje.getDay() + offset + 7) % 7;
  return { idx, en: diasEN[idx], pt: diasPT[idx] };
}

btnCalendario.onclick = () => {
  bloquearBotoesMenu(true);
  modalCalendario.style.display = "flex";
  telaAtual = "calendario";
  calOffset = 0;
  carregarCalendarioDia(calOffset);
};

btnCalOntem.onclick = () => {
  calOffset = -1;
  carregarCalendarioDia(calOffset);
};

btnCalHoje.onclick = () => {
  calOffset = 0;
  carregarCalendarioDia(calOffset);
};

btnCalAmanha.onclick = () => {
  calOffset = 1;
  carregarCalendarioDia(calOffset);
};

async function carregarCalendarioDia(offset) {
  const dia = getDiaTarget(offset);

  calTitulo.textContent = `Calendário — ${dia.pt}`;
  calLista.innerHTML = "<p style='color:white'>Carregando...</p>";

  // Cache leve por dia (10 min)
  const cacheKey = `cal-${dia.en}`;
  const cacheRaw = localStorage.getItem(cacheKey);

  if (cacheRaw) {
    try {
      const cache = JSON.parse(cacheRaw);
      const age = Date.now() - cache.time;
      if (age < 10 * 60 * 1000) { // 10 min
        renderCalendario(cache.items);
        return;
      }
    } catch (_) {}
  }

  try {
    // Endpoint de schedule por dia (Jikan v4)
    const url = `https://api.jikan.moe/v4/schedules/${dia.en}?sfw=true&limit=25`;
    const res = await fetch(url);
    const data = await res.json();

    const items = data.data || [];
    localStorage.setItem(cacheKey, JSON.stringify({ time: Date.now(), items }));

    renderCalendario(items);
  } catch (err) {
    console.error(err);
    calLista.innerHTML = "<p style='color:white'>Erro ao carregar o calendário.</p>";
  }
}

function renderCalendario(animes) {
  calLista.innerHTML = "";

  if (!animes.length) {
    calLista.innerHTML = "<p style='color:white'>Nenhum lançamento encontrado para este dia.</p>";
    return;
  }

  animes.forEach(anime => {
    const titulo = anime.title || "Sem título";
    const img = anime.images?.jpg?.image_url || "";

    // horário (quando existir)
    const b = anime.broadcast || {};
    const hora = b.time ? `${b.time}${b.timezone ? " (" + b.timezone + ")" : ""}` : "Horário não informado";

    // total de episódios (quando existir)
    const eps = anime.episodes ?? "N/A";

    const card = document.createElement("div");
    card.className = "cal-card";
    card.innerHTML = `
      ${img ? `<img src="${img}" alt="${titulo}">` : ""}
      <div>
        <h4>${titulo}</h4>
        <p>🕒 ${hora}</p>
        <p>🎞️ Episódios: ${eps}</p>
      </div>
    `;

    // opcional: clicar abre detalhes do mesmo modal de detalhes que você já tem
    card.onclick = () => abrirDetalhes(anime);

    calLista.appendChild(card);
  });
}

const btnCalVoltar = document.getElementById("cal-voltar");

btnCalVoltar.addEventListener("click", () => {
  modalCalendario.style.display = "none";
  telaAtual = null;
  bloquearBotoesMenu(false);
});

const btnBuscar = document.getElementById("btn-buscar");

btnBuscar.addEventListener("click", () => {
  buscarAnimes();
});
