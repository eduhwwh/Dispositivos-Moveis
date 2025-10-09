const btnSom = document.getElementById('toggle-sound');
const btnVoltar = document.getElementById('resume-game');
const btnReiniciar = document.getElementById('restart-game');
const btnMenu = document.getElementById('home-menu');

// Lê configuração do som do localStorage
let somAtivo = localStorage.getItem('somAtivo');
if (somAtivo === null) somAtivo = 'true'; // padrão: som ligado
atualizarTextoBotao();

function atualizarTextoBotao() {
  btnSom.textContent = somAtivo === 'true' ? '🔊 Som: Ativado' : '🔇 Som: Desativado';
}

// Alterna som
btnSom.addEventListener('click', () => {
  somAtivo = somAtivo === 'true' ? 'false' : 'true';
  localStorage.setItem('somAtivo', somAtivo);
  atualizarTextoBotao();
});

// Voltar ao jogo
btnVoltar.addEventListener('click', () => {
  window.location.href = 'game.html';
});

// Reiniciar jogo
btnReiniciar.addEventListener('click', () => {
  localStorage.setItem('reiniciar', 'true'); // game.js vai detectar isso
  window.location.href = 'game.html';
});

// Menu inicial
btnMenu.addEventListener('click', () => {
  window.location.href = 'index.html';
});
