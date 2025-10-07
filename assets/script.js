const labirinto = document.getElementById('labirinto');
const player = document.getElementById('player');
const fantasma = document.getElementById('fantasma');
const vela = document.getElementById('vela');
const mensagem = document.getElementById('mensagem');

const tamanho = 50;
const mapa = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,0,1],
  [1,0,1,0,1,0,1,1,0,1],
  [1,0,1,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,0,1,0,1],
  [1,0,0,0,0,0,0,1,0,1],
  [1,1,1,1,1,1,0,1,0,1],
  [1,0,0,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,1,1,0,1],
  [1,1,1,1,1,1,1,1,1,1]
];

// Posição inicial
let playerPos = { x: 1, y: 1 };
let fantasmaPos = { x: 8, y: 1 };
let velaPos = { x: 8, y: 8 };

// Renderiza o labirinto
mapa.forEach(linha => {
  linha.forEach(celula => {
    const div = document.createElement('div');
    div.classList.add('celula');
    div.classList.add(celula === 1 ? 'parede' : 'caminho');
    labirinto.appendChild(div);
  });
});

// Atualiza posições na tela
function atualizarPosicoes() {
  player.style.left = playerPos.x * tamanho + 'px';
  player.style.top = playerPos.y * tamanho + 'px';
  fantasma.style.left = fantasmaPos.x * tamanho + 'px';
  fantasma.style.top = fantasmaPos.y * tamanho + 'px';
  vela.style.left = velaPos.x * tamanho + 'px';
  vela.style.top = velaPos.y * tamanho + 'px';
}

atualizarPosicoes();

// Movimento do jogador
document.addEventListener('keydown', (e) => {
  let novaPos = { ...playerPos };
  if (e.key === 'ArrowUp') novaPos.y--;
  if (e.key === 'ArrowDown') novaPos.y++;
  if (e.key === 'ArrowLeft') novaPos.x--;
  if (e.key === 'ArrowRight') novaPos.x++;

  if (mapa[novaPos.y][novaPos.x] === 0) {
    playerPos = novaPos;
    atualizarPosicoes();
    verificar();
  }
});

// Movimento automático do fantasma
const direcoes = [
  {x:0,y:1}, {x:1,y:0}, {x:0,y:-1}, {x:-1,y:0}
];
let dirIndex = 0;

function moverFantasma() {
  const novaPos = {
    x: fantasmaPos.x + direcoes[dirIndex].x,
    y: fantasmaPos.y + direcoes[dirIndex].y
  };
  if (mapa[novaPos.y][novaPos.x] === 0) {
    fantasmaPos = novaPos;
  } else {
    dirIndex = (dirIndex + 1) % direcoes.length; // muda direção
  }
  atualizarPosicoes();
  verificar();
}

setInterval(moverFantasma, 700);

// Verifica colisão
function verificar() {
  if (playerPos.x === fantasmaPos.x && playerPos.y === fantasmaPos.y) {
    mensagem.textContent = '💀 O fantasma te pegou!';
    playerPos = { x: 1, y: 1 };
  }
  if (playerPos.x === velaPos.x && playerPos.y === velaPos.y) {
    mensagem.textContent = '🕯️ Você acendeu a vela!';
  }
}
