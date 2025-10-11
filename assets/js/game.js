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

const modoComTempo = localStorage.getItem('modoJogo') === 'tempo';

function criarCartas() {
  board.innerHTML = "";
  cards = [];
  flippedCards = [];
  lockBoard = false;
  tentativas = 0;
  attemptsDisplay.textContent = `Tentativas: ${tentativas}`;

  const emojis = [
    "🎃","👻","🕷️","🦇","🍬","🕸️","💀","🧙‍♀️","🧛‍♂️","🧟‍♂️",
    "🧌","🪄","🩸","🪦","🕯️","☠️","🧹","🦴","🧠","🌕",
    "🌑","🧤","🍭","🧛‍♀️","🔮","🧞‍♂️","🧿","🧯","🩻","🪬"
  ];

  let qtdPares = 4 + (level - 1) * 2;
  if (qtdPares > emojis.length) qtdPares = emojis.length;

  const selecionados = emojis.slice(0, qtdPares);
  const cartas = [...selecionados, ...selecionados];
  cartas.sort(() => 0.5 - Math.random());

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
    card.innerHTML = `
      <div class="front">${emoji}</div>
      <div class="back">🎩</div>
    `;
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
}

function mostrarTodasTemporariamente(callback) {
  cards.forEach((card) => card.classList.add("flipped"));
  setTimeout(() => {
    cards.forEach((card) => card.classList.remove("flipped"));
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
  }
}

function checarPar() {
  const [c1, c2] = flippedCards;
  const match = c1.dataset.emoji === c2.dataset.emoji;

  if (match) {
    soundAcerto && soundAcerto.play();
    c1.classList.add("matched");
    c2.classList.add("matched");
    flippedCards = [];
    verificarVitoria();
  } else {
    soundErro && soundErro.play();
    lockBoard = true;
    setTimeout(() => {
      c1.classList.remove("flipped");
      c2.classList.remove("flipped");
      flippedCards = [];
      lockBoard = false;
    }, 1000);
  }
}

function verificarVitoria() {
  const venceu = cards.every((c) => c.classList.contains("matched"));
  if (venceu) {
    clearInterval(timer);
    setTimeout(() => {
      soundVitoria && soundVitoria.play();
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
  setTimeout(criarCartas, 1500);
}

function atualizarNivel() {
  levelDisplay.textContent = `Nível ${level}`;
}

// reiniciar
restartBtn.addEventListener("click", () => {
  level = 1;
  tempoMostra = 3000;
  tempoRestante = 60;
  clearInterval(timer);
  criarCartas();
});

// TIMER — modo com tempo
function iniciarTimer() {
  clearInterval(timer);
  tempoRestante = 60;
  timerDisplay.textContent = `⏳ Tempo: ${tempoRestante}s`;

  timer = setInterval(() => {
    tempoRestante--;
    timerDisplay.textContent = `⏳ Tempo: ${tempoRestante}s`;
    if (tempoRestante <= 0) {
      clearInterval(timer);
      revelarCartas();
      encerrarJogoPorTempo();
    }
  }, 1000);
}

function revelarCartas() {
  cards.forEach((card) => card.classList.add("flipped"));
}

function encerrarJogoPorTempo() {
  lockBoard = true;
  mostrarMensagem(`⏰ Tempo esgotado! Tentativas: ${tentativas}`);
}

// inicializa
document.addEventListener('DOMContentLoaded', () => {
  criarCartas();
});

document.getElementById('config-btn').addEventListener('click', () => {
  window.location.href = 'config.html';
});

// Detecta se veio do config com reiniciar
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('reiniciar') === 'true') {
    localStorage.removeItem('reiniciar');
    level = 1;
    criarCartas();
  }
});

function playSound(sound) {
  const somAtivo = localStorage.getItem('somAtivo') !== 'false';
  if (somAtivo && sound) sound.play();
}

playSound(soundAcerto);
playSound(soundErro);
playSound(soundVitoria);
playSound(soundAmbiente);
