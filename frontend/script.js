html, body {
  margin: 0;
  padding: 0;
}

/* Background */
body {
  background-image: url("https://github.com/32Sam/tcc/blob/main/images/bg.jpg?raw=true");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed; /* 👈 ESSA LINHA RESOLVE */
  overflow-x: hidden;
}

/* Filtro escuro */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 0;
  pointer-events: none;
}

/* HERO */
.hero {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
}

.hero h1 {
  font-size: 2.8rem;
  margin-bottom: 35px;
  font-weight: 600;
  letter-spacing: 1px;
  text-shadow: 
    0 0 10px rgba(255,255,255,0.1),
    0 10px 40px rgba(0,0,0,0.8);
}

.catalog:empty {
  display: none;
}

/* Busca */
.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 40px;
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(10px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.4);
}

.search-box input {
  background: transparent;
  color: white;
  width: 300px;
  padding: 12px 15px;
  border-radius: 25px;
  border: none;
  outline: none;
  font-size: 1rem;
}

.search-box button {
  padding: 10px 20px;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.25s ease;
  background: rgba(255,255,255,0.15);
  color: white;
  backdrop-filter: blur(6px);
}

.search-box button:hover {
  background: #f5c518;
  color: black;
  transform: translateY(-2px);
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.8) 0%,
    rgba(0,0,0,0.6) 40%,
    rgba(0,0,0,0.9) 100%
  );
  z-index: 0;
  pointer-events: none;
}

.search-box input::placeholder {
  color: rgba(255,255,255,0.6);
}

.hero {
  animation: fadeHero 1.2s ease;
}

@keyframes fadeHero {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* MODAL */
/* MODAL PADRÃO */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

/* MODAL DETALHES ACIMA DE TUDO */
#modal-detalhes {
  z-index: 100;
}

.modal-content {
  background: #111;
  color: white;
  padding: 30px;
  border-radius: 12px;
  width: 420px;
  text-align: center;
}

.genres {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.genres button {
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.06);
  color: #eaeaea;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: all 0.25s ease;
  font-weight: 500;
  letter-spacing: 0.3px;
}

/* Hover */
.genres button:hover {
  background: rgba(255,255,255,0.12);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.4);
}

/* Quando ativo */
.genres button.ativo {
  background: linear-gradient(135deg, #f5c518, #ffdf60);
  color: black;
  font-weight: 600;
  box-shadow: 0 0 15px rgba(245,197,24,0.6);
  border: none;
}

/* Clique */
.genres button:active {
  transform: scale(0.95);
}

#aplicar-filtros {
  margin-top: 25px;
  padding: 12px 28px;
  border-radius: 30px;
  border: none;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  background: linear-gradient(135deg, #f5c518, #ffdf60);
  color: black;
  letter-spacing: 0.5px;
  transition: all 0.25s ease;
  box-shadow: 0 8px 25px rgba(245,197,24,0.35);
}

/* Hover */
#aplicar-filtros:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(245,197,24,0.55);
}

/* Clique */
#aplicar-filtros:active {
  transform: scale(0.95);
  box-shadow: 0 5px 15px rgba(245,197,24,0.4);
}

/* CATÁLOGO */
.catalog {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  padding: 40px;
}

.card {
  background: #111;
  border-radius: 12px;
  overflow: hidden;
  color: white;
  cursor: pointer;
}

.card img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.card h3 {
  padding: 10px;
  text-align: center;
  font-size: 1rem;
}

/* BOTÃO VOLTAR AO TOPO */
#btn-topo {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: white;
  color: black;
  font-size: 22px;
  font-weight: bold;
  display: none;
  z-index: 30;
}

/* ===============================
   ✅ MODAL DETALHES (APENAS INCLUSÃO/ATUALIZAÇÃO)
   - badge circular de score
   - fundo com leve gradiente
   - efeito glassmorphism
   - scroll customizado na sinopse
=============================== */

/* mantém sua classe, só melhora visual */
.modal-detalhes-content {
  width: 900px;
  max-width: 95%;
  border-radius: 20px;
  padding: 40px;

  /* leve gradiente (você pediu) */
  background: linear-gradient(145deg, rgba(20,20,20,0.92), rgba(12,12,12,0.85));

  /* glass */
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 25px 60px rgba(0,0,0,0.6);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);

  animation: modalFade 0.25s ease;
}

@keyframes modalFade {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* seu novo header do modal (título + badge) */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 22px;
}

#detalhe-titulo {
  font-size: 2rem;
  margin: 0;
  font-weight: 600;
  letter-spacing: 1px;
}

/* badge circular de score */
.score-badge {
  width: 74px;
  height: 74px;
  border-radius: 50%;
  display: grid;
  place-items: center;

  background: rgba(245, 197, 24, 0.12);
  border: 2px solid rgba(245, 197, 24, 0.55);
  box-shadow: 0 12px 24px rgba(0,0,0,0.35);
}

.score-badge span {
  font-weight: 800;
  font-size: 1.1rem;
  color: #f5c518;
}

/* corpo e imagem (mantém suas classes) */
.detalhes-body {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.detalhes-texto {
  flex: 1.3;
  text-align: left;
  font-size: 0.95rem;
  line-height: 1.7;
  color: #e6e6e6;
}

/* status e episódios no topo */
.info-top {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

#detalhe-status,
#detalhe-episodios {
  font-weight: 600;
  margin: 0;
  color: #f5c518;
}

/* sinopse com scroll bonito */
.sinopse-container {
  max-height: 260px;
  overflow-y: auto;
  padding-right: 10px;
}

/* scroll custom */
.sinopse-container::-webkit-scrollbar {
  width: 7px;
}

.sinopse-container::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.06);
  border-radius: 10px;
}

.sinopse-container::-webkit-scrollbar-thumb {
  background: rgba(245,197,24,0.75);
  border-radius: 10px;
}

.sinopse-container::-webkit-scrollbar-thumb:hover {
  background: rgba(245,197,24,0.95);
}

.detalhes-imagem img {
  width: 260px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

#fechar-detalhes {
  margin-top: 30px;
  padding: 10px 25px;
  border-radius: 30px;
  border: none;
  background: #f5c518;
  color: black;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s ease;
}

#fechar-detalhes:hover {
  transform: scale(1.05);
}

/* ===============================
   RESTO DO SEU CSS ORIGINAL (SEM MEXER)
=============================== */

.active-filters {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  align-items: center;
  color: white;
  font-size: 0.9rem;
}

.active-filters span {
  background: #1f1f1f;
  padding: 6px 10px;
  border-radius: 12px;
}

.active-filters button {
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 6px 10px;
  border-radius: 12px;
  cursor: pointer;
}

#btn-top-animes {
  position: fixed;
  top: 15px;
  left: 15px;
  padding: 10px 14px;
  background: gold;
  border-radius: 8px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  z-index: 50;
}

#lista-anos button,
#resultado-top div {
  background: gold;
  margin-top: 10px;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-voltar {
  margin-top: 35px;
  padding: 10px 28px;
  border-radius: 30px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.05);
  color: #eaeaea;
  font-weight: 500;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: all 0.25s ease;
  letter-spacing: 0.5px;
}

.btn-voltar:hover {
  background: rgba(255,255,255,0.15);
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.5);
}

.btn-voltar:active {
  transform: scale(0.95);
}

/* ===== LAYOUT TOP ANIMES ===== */

.modal-top-layout {
  width: 800px;
  max-width: 95%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.top-graficos {
  display: flex;
  gap: 30px;
  margin-top: 20px;
  align-items: center;
  justify-content: space-between;
}

/* Gráfico de barras (Top 5) */
.grafico-barra {
  flex: 2;
}

/* Gráfico de pizza (gêneros) */
.grafico-pizza {
  flex: 1;
  max-width: 250px;
}

/* BOTÃO VOLTAR (TOP ANIMES) */
.btn-voltar {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 0.95rem;
  margin-top: 25px;
  align-self: center;
  opacity: 0.8;
}

.btn-voltar:hover {
  opacity: 1;
  text-decoration: underline;
}

#btn-popularidade {
  position: fixed;
  top: 15px;
  left: 150px;
  padding: 10px 14px;
  background: gold;
  border-radius: 8px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  z-index: 50;
}

.grafico-pizza-pop {
  margin-top: 30px;
  max-width: 400px;
  align-self: center;
}

#graficoGenerosPop {
  height: 300px !important;
}

.modal-pop-layout {
  width: 850px;
  max-width: 95%;
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pop-graficos {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px; /* equilíbrio visual */
  margin-top: 35px;
  margin-bottom: 20px;
}

/* Containers individuais */
.modal-pop-layout .grafico-barra {
  width: 420px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ===== BOTÃO CALENDÁRIO ===== */
#btn-calendario {
  position: fixed;
  top: 15px;
  right: 15px;          /* fica no canto direito */
  left: auto;           /* garante que não use o left */
  padding: 10px 14px;
  background: #1dcaff;
  border-radius: 8px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  z-index: 50;
}

/* ===== MODAL CALENDÁRIO ===== */
.modal-cal-layout {
  width: 1000px;
  max-width: 95%;
  padding: 50px 40px;
  border-radius: 22px;
  background: linear-gradient(145deg, #141414, #0f0f0f);
  box-shadow: 0 30px 80px rgba(0,0,0,0.7);
  backdrop-filter: blur(6px);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: modalFade 0.25s ease;
}

.cal-nav {
  display: flex;
  gap: 12px;
  margin: 15px 0 20px;
}

.cal-nav button {
  padding: 10px 18px;
  border-radius: 25px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.07);
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.25s ease;
}

.cal-nav button:hover {
  background: rgba(255,255,255,0.15);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.4);
}

.cal-nav button:active {
  transform: scale(0.95);
}

.cal-lista {
  width: 100%;
  max-height: 450px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
  padding: 10px;
}

/* Scroll personalizado */
.cal-lista::-webkit-scrollbar {
  width: 8px;
}

.cal-lista::-webkit-scrollbar-track {
  background: transparent;
}

.cal-lista::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.15);
  border-radius: 10px;
}

.cal-lista::-webkit-scrollbar-thumb:hover {
  background: rgba(245,197,24,0.6);
}

/* Card de calendário */
.cal-card {
  background: linear-gradient(145deg, #1a1a1a, #131313);
  border-radius: 16px;
  padding: 14px;
  display: flex;
  gap: 14px;
  align-items: center;
  transition: all 0.25s ease;
  border: 1px solid rgba(255,255,255,0.05);
}

.cal-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.6);
  border: 1px solid rgba(245,197,24,0.3);
}

.cal-card img {
  width: 60px;
  height: 85px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.5);
}

.cal-card h4 {
  margin: 0 0 6px;
  font-size: 0.95rem;
  line-height: 1.2;
}

.cal-card p {
  margin: 2px 0;
  font-size: 0.85rem;
  opacity: 0.9;
}

#cal-voltar {
  margin-top: 30px;
  padding: 10px 26px;
  border-radius: 30px;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.06);
  color: #eaeaea;
  font-weight: 500;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: all 0.25s ease;
}

#cal-voltar:hover {
  background: rgba(255,255,255,0.15);
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
}

#cal-voltar:active {
  transform: scale(0.95);
}
