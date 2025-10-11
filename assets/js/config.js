const btnSom = document.getElementById('toggle-sound');
const btnVoltar = document.getElementById('resume-game');
const btnReiniciar = document.getElementById('restart-game');
const btnMenu = document.getElementById('home-menu');

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
