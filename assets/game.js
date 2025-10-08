const board = document.getElementById('game-board');
const restartBtn = document.getElementById('restart-btn');
const levelDisplay = document.getElementById('level-display');
const message = document.getElementById('message');

const soundAcerto = document.getElementById('sound-acerto');
const soundErro = document.getElementById('sound-erro');
const soundVitoria = document.getElementById('sound-vitoria');

let level = 1;
let cards = [];
let flippedCards = [];
let lockBoard = false;
let tempoMostra = 5000;

function criarCartas() {
  board.innerHTML = "";
  cards = [];
  flippedCards = [];
  lockBoard = false;

  // 🎃 Lista com muitos emojis de Halloween
  const emojis = [
    "🎃", "👻", "🕷️", "🦇", "🍬", "🕸️", "💀", "🧙‍♀️", "🧛‍♂️", "🧟‍♂️",
    "🧌", "🪄", "🩸", "🪦", "🕯️", "☠️", "🧹", "🦴", "🧠", "🌕",
    "🌑", "🧤", "🍭", "🧛‍♀️", "🔮", "🧞‍♂️", "🧿", "🧯", "🩻", "🪬"
  ];

  // 🔸 Aumenta o número de pares conforme o nível
  let qtdPares = 4 + (level - 1) * 2;
  if (qtdPares > emojis.length) qtdPares = emojis.length;

  // Seleciona os emojis e duplica para formar pares
  const selecionados = emojis.slice(0, qtdPares);
  const cartas = [...selecionados, ...selecionados];

  // 🔸 Embaralha as cartas
  cartas.sort(() => 0.5 - Math.random());

  // 🔸 Calcula a grade ideal (sem buracos)
  const total = cartas.length;
  let colunas = Math.ceil(Math.sqrt(total));
  let linhas = Math.ceil(total / colunas);
  while (linhas * colunas !== total) {
    colunas++;
    linhas = Math.ceil(total / colunas);
  }

  board.style.gridTemplateColumns = `repeat(${colunas}, 100px)`;
  board.style.gridTemplateRows = `repeat(${linhas}, 100px)`;

  // 🔸 Cria as cartas no tabuleiro
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
  mostrarTodasTemporariamente();
}

function mostrarTodasTemporariamente() {
  cards.forEach((card) => card.classList.add("flipped"));
  setTimeout(() => {
    cards.forEach((card) => card.classList.remove("flipped"));
  }, tempoMostra);
}

function virarCarta() {
  if (lockBoard || this.classList.contains('matched') || this.classList.contains('flipped')) return;

  this.classList.add("flipped");
  flippedCards.push(this);

  if (flippedCards.length === 2) checarPar();
}

function checarPar() {
  const [c1, c2] = flippedCards;
  const match = c1.dataset.emoji === c2.dataset.emoji;

  if (match) {
    soundAcerto.currentTime = 0;
    soundAcerto.play();

    c1.classList.add("matched");
    c2.classList.add("matched");
    flippedCards = [];

    verificarVitoria();
  } else {
    soundErro.currentTime = 0;
    soundErro.play();

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
    setTimeout(() => {
      soundVitoria.play();
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
  level++;
  tempoMostra = Math.max(2000, tempoMostra - 500);
  setTimeout(criarCartas, 2500);
}

function atualizarNivel() {
  levelDisplay.textContent = `Nível ${level}`;
}

restartBtn.addEventListener("click", () => {
  level = 1;
  tempoMostra = 5000;
  criarCartas();
});

criarCartas();
