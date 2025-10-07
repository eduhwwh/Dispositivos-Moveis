const board = document.getElementById('game-board');
const restartBtn = document.getElementById('restart-btn');

const imagens = ['🎃', '👻', '🕷️', '🧙', '🦇', '💀', '🕸️', '🧛'];

let cards = [];
let flippedCards = [];
let lockBoard = false;

function criarCartas() {
  const embaralhadas = [...imagens, ...imagens].sort(() => Math.random() - 0.5);

  board.innerHTML = '';
  cards = [];

  embaralhadas.forEach((emoji) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;

    const span = document.createElement('span');
    span.textContent = emoji;
    card.appendChild(span);

    board.appendChild(card);
    cards.push(card);

    card.addEventListener('click', virarCarta);
  });

  mostrarTodasPor5Segundos();
}

function mostrarTodasPor5Segundos() {
  // Mostra os emojis por 5 segundos (sem mudar cor)
  cards.forEach((card) => {
    const span = card.querySelector('span');
    span.style.opacity = '1';
  });

  // Após 5 segundos, "vira" as cartas (esconde emojis)
  setTimeout(() => {
    cards.forEach((card) => {
      const span = card.querySelector('span');
      span.style.opacity = '0';
    });
  }, 5000);
}

function virarCarta() {
  if (lockBoard || this.classList.contains('hidden')) return;

  const span = this.querySelector('span');

  // se já estiver virada, ignora
  if (span.style.opacity === '1') return;

  span.style.opacity = '1';
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    checarPar();
  }
}

function checarPar() {
  const [c1, c2] = flippedCards;

  if (c1.dataset.emoji === c2.dataset.emoji) {
    // Se forem iguais, somem
    setTimeout(() => {
      c1.classList.add('hidden');
      c2.classList.add('hidden');
      flippedCards = [];
      verificarVitoria();
    }, 600);
  } else {
    // Se forem diferentes, viram novamente
    lockBoard = true;
    setTimeout(() => {
      c1.querySelector('span').style.opacity = '0';
      c2.querySelector('span').style.opacity = '0';
      flippedCards = [];
      lockBoard = false;
    }, 1000);
  }
}

function verificarVitoria() {
  const todasSumiram = cards.every((c) => c.classList.contains('hidden'));
  if (todasSumiram) {
    setTimeout(() => alert('👑 Parabéns! Você venceu o jogo! 🎃'), 500);
  }
}

restartBtn.addEventListener('click', () => {
  flippedCards = [];
  criarCartas();
});

criarCartas();
