const bgMusic     = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

const savedMute = localStorage.getItem("musicMuted");
if (savedMute === "true") {
    bgMusic.muted = true;
    musicToggle.textContent = "🔇";
}

document.addEventListener("click", () => {
    if (bgMusic.paused) {
        bgMusic.volume = 0.15;
        bgMusic.play();
    }
}, { once: true });

musicToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    bgMusic.muted = !bgMusic.muted;
    musicToggle.textContent = bgMusic.muted ? "🔇" : "🔊";
    localStorage.setItem("musicMuted", bgMusic.muted);
});