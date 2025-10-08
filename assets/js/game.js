const board = document.getElementById('game-board');
const restartBtn = document.getElementById('restart-btn');
const levelDisplay = document.getElementById('level-display');
const message = document.getElementById('message');
const timerDisplay = document.getElementById('timer');
const attemptsDisplay = document.getElementById('attempts-display');

const soundAcerto = document.getElementById('sound-acerto');
const soundErro = document.getElementById('sound-erro');
const soundVitoria = document.getElementById('sound-vitoria');

let level = 1;
let cards = [];
let flippedCards = [];
let lockBoard = false;
let tempoMostra = 3000;
let tempoRestante = 60;
let timer = null;
let tentativas = 0;
let modoComTempo = localStorage.getItem('mode') === 'tempo';
let somAtivo = localStorage.getItem('sound') !== 'off';

function criarCartas() {
  board.innerHTML = "";
  cards = [];
  flippedCards = [];
  lockBoard = false;
  tentativas = tentativas || 0;
  attemptsDisplay.textContent = `Tentativas: ${tentativas}`;

  const emojis = [
    "🎃","👻","🕷️","🦇","🍬","🕸️","💀","🧙‍♀️","🧛‍♂️","🧟‍♂️",
    "🧌","🪄","🩸","🪦","🕯️","☠️","🧹","🦴","🧠","🌕",
    "🌑","🧤","🍭","🧛‍♀️","🔮","🧞‍♂️","🧿","🧯","🩻","🪬"
  ];

  let qtdPares = 4 + (level - 1) * 2;
  if (qtdPares > emojis.length) qtdPares = emojis.length;

  const selecionados = emojis.slice(0, qtdPares);
  const cartas = [...selecionados, ...selecionados].sort(() => 0.5 - Math.random());

  const total = cartas.length;
  let colunas = Math.ceil(Math.sqrt(total));
  let linhas = Math.ceil(total / colunas);
  while (linhas * colunas !== total) {
    colunas++;
    linhas = Math.ceil(total / colunas);
  }

  board.style.gridTemplateColumns = `repeat(${colunas}, 100px)`;
  board.style.gridTemplateRows = `repeat(${linhas}, 100px)`;

  cartas.forEach((emoji) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.innerHTML = `<div class="front">${emoji}</div><div class="back">🎩</div>`;
    card.addEventListener("click", virarCarta);
    board.appendChild(card);
    cards.push(card);
  });

  atualizarNivel();

  mostrarTodasTemporariamente(() => {
    if (modoComTempo) {
      iniciarTimer();
      timerDisplay.style.display = 'inline-block';
    } else {
      timerDisplay.style.display = 'none';
      clearInterval(timer);
    }
  });

  salvarProgresso();
}

function mostrarTodasTemporariamente(callback) {
  cards.forEach(c => c.classList.add("flipped"));
  setTimeout(() => {
    cards.forEach(c => c.classList.remove("flipped"));
    if (typeof callback === 'function') callback();
  }, tempoMostra);
}

function virarCarta() {
  if (lockBoard || this.classList.contains('matched') || this.classList.contains('flipped')) return;
  this.classList.add("flipped");
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    tentativas++;
    attemptsDisplay.textContent = `Tentativas: ${tentativas}`;
    checarPar();
    salvarProgresso();
  }
}

function checarPar() {
  const [c1, c2] = flippedCards;
  const match = c1.dataset.emoji === c2.dataset.emoji;

  if (match) {
    if (somAtivo) soundAcerto.play();
    c1.classList.add("matched");
    c2.classList.add("matched");
    flippedCards = [];
    verificarVitoria();
  } else {
    if (somAtivo) soundErro.play();
    lockBoard = true;
    setTimeout(() => {
      c1.classList.remove("flipped");
      c2.classList.remove("flipped");
      flippedCards = [];
      lockBoard = false;
      salvarProgresso();
    }, 1000);
  }
}

function verificarVitoria() {
  const venceu = cards.every((c) => c.classList.contains("matched"));
  if (venceu) {
    clearInterval(timer);
    setTimeout(() => {
      if (somAtivo) soundVitoria.play();
      mostrarMensagem(`🕯️ Nível ${level} completo!`);
      proximoNivel();
    }, 700);
  }
}

function mostrarMensagem(texto) {
  message.textContent = texto;
  message.classList.add("show");
  setTimeout(() => message.classList.remove("show"), 2500);
}

function proximoNivel() {
  clearInterval(timer);
  level++;
  tempoMostra = Math.max(2000, tempoMostra - 500);
  tempoRestante = 60;
  tentativas = 0;
  setTimeout(criarCartas, 1500);
}

function atualizarNivel() {
  levelDisplay.textContent = `Nível ${level}`;
}

restartBtn.addEventListener("click", () => {
  localStorage.removeItem("gameState");
  level = 1;
  tempoMostra = 3000;
  tempoRestante = 60;
  tentativas = 0;
  clearInterval(timer);
  criarCartas();
});

function iniciarTimer() {
  clearInterval(timer);
  tempoRestante = tempoRestante || 60;
  timerDisplay.textContent = `⏳ Tempo: ${tempoRestante}s`;

  timer = setInterval(() => {
    tempoRestante--;
    timerDisplay.textContent = `⏳ Tempo: ${tempoRestante}s`;
    if (tempoRestante <= 0) {
      clearInterval(timer);
      revelarCartas();
      encerrarJogoPorTempo();
    }
    salvarProgresso();
  }, 1000);
}

function revelarCartas() {
  cards.forEach((c) => c.classList.add("flipped"));
}

function encerrarJogoPorTempo() {
  lockBoard = true;
  mostrarMensagem(`⏰ Tempo esgotado! Tentativas: ${tentativas}`);
}

function salvarProgresso() {
  const estado = {
    level,
    tentativas,
    tempoMostra,
    tempoRestante,
    modoComTempo,
    somAtivo,
    cartas: cards.map(c => ({
      emoji: c.dataset.emoji,
      flipped: c.classList.contains("flipped"),
      matched: c.classList.contains("matched")
    }))
  };
  localStorage.setItem("gameState", JSON.stringify(estado));
}

function restaurarProgresso() {
  const salvo = localStorage.getItem("gameState");
  if (!salvo) {
    criarCartas();
    return;
  }

  const estado = JSON.parse(salvo);
  level = estado.level;
  tentativas = estado.tentativas;
  tempoMostra = estado.tempoMostra;
  tempoRestante = estado.tempoRestante;
  modoComTempo = estado.modoComTempo;
  somAtivo = estado.somAtivo;

  board.innerHTML = "";
  cards = [];
  estado.cartas.forEach(info => {
    const card = document.createElement("div");
    card.classList.add("card");
    if (info.flipped) card.classList.add("flipped");
    if (info.matched) card.classList.add("matched");
    card.dataset.emoji = info.emoji;
    card.innerHTML = `<div class="front">${info.emoji}</div><div class="back">🎩</div>`;
    card.addEventListener("click", virarCarta);
    board.appendChild(card);
    cards.push(card);
  });

  atualizarNivel();
  attemptsDisplay.textContent = `Tentativas: ${tentativas}`;

  if (modoComTempo) iniciarTimer();
}

document.addEventListener("DOMContentLoaded", () => {
  restaurarProgresso();
});

const floatingConfig = document.getElementById("floatingConfig");
if (floatingConfig) {
  floatingConfig.addEventListener("click", () => {
    window.location.href = "config.html";
  });
}
