// Captura os botões de escolha de modo
const buttons = document.querySelectorAll('.level-btn');
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const modo = btn.dataset.mode;
        localStorage.setItem('modoJogo', modo);

        // Limpa qualquer progresso salvo de partida anterior ao iniciar uma nova
        localStorage.removeItem('progressoJogo');

        window.location.href = 'game.html';
    });
});

// Botão flutuante de configuração
const floatingConfig = document.getElementById("floatingConfig");
floatingConfig.addEventListener("click", () => {
    // Evita redirecionar se já estiver na página de config
    if (!window.location.pathname.endsWith("config.html")) {
        window.location.href = "config.html";
    }
});
