const buttons = document.querySelectorAll('.level-btn');

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const modo = btn.dataset.mode;
        localStorage.setItem('modoJogo', modo);
        window.location.href = 'game.html';
    });
});

const soundAmbiente = document.getElementById('sound-ambiente');

function playSound(audioElement) {
    if (audioElement) {
        audioElement.volume = 0.5;
        audioElement.play().catch((err) => {
            console.warn('Autoplay bloqueado:', err);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    playSound(soundAmbiente);
});

document.addEventListener('click', () => {
    playSound(soundAmbiente);
}, { once: true });
