// Carregar configurações ao abrir a página
window.addEventListener("DOMContentLoaded", () => {
  const soundToggle = document.getElementById("sound-toggle");
  const modeSelect = document.getElementById("mode-select");

  // Carregar valores salvos
  const sound = localStorage.getItem("sound") || "on";
  const mode = localStorage.getItem("mode") || "normal";

  soundToggle.value = sound;
  modeSelect.value = mode;

  // Eventos de mudança
  soundToggle.addEventListener("change", () => {
    localStorage.setItem("sound", soundToggle.value);
  });

  modeSelect.addEventListener("change", () => {
    localStorage.setItem("mode", modeSelect.value);
  });

  // Botão: voltar ao jogo
  document.getElementById("resume-game").addEventListener("click", () => {
    window.location.href = "game.html";
  });

  // Botão: reiniciar
  document.getElementById("restart-game").addEventListener("click", () => {
    localStorage.removeItem("gameState");
    window.location.href = "game.html";
  });

  // Botão: voltar ao menu inicial
  document.getElementById("home-btn").addEventListener("click", () => {
    window.location.href = "index.html";
  });
});
