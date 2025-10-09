const buttons = document.querySelectorAll('.level-btn');
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const modo = btn.dataset.mode;
        localStorage.setItem('modoJogo', modo);
        window.location.href = 'game.html';
    });
});