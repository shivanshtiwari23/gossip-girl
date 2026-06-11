const splash     = document.getElementById("splash");
const splashLogo = document.getElementById("splashLogo");
const splashTag  = document.getElementById("splashTag");
const splashHint = document.getElementById("splashHint");

setTimeout(() => { splashLogo.style.opacity = "1"; }, 300);
setTimeout(() => { splashTag.style.opacity  = "1"; }, 1000);
setTimeout(() => { splashHint.style.opacity = "1"; }, 1600);

splash.addEventListener("click", () => {

    const stripTop    = document.getElementById("stripTop").parentElement;
    const stripBottom = document.getElementById("stripBottom").parentElement;

    stripTop.style.transition    = "transform 0.3s ease, opacity 0.3s ease";
    stripTop.style.transform     = "translateY(-100%)";
    stripTop.style.opacity       = "0";

    stripBottom.style.transition = "transform 0.3s ease, opacity 0.3s ease";
    stripBottom.style.transform  = "translateY(100%)";
    stripBottom.style.opacity    = "0";

    splashTag.style.transition  = "opacity 0.4s ease";
    splashTag.style.opacity     = "0";
    splashHint.style.transition = "opacity 0.4s ease";
    splashHint.style.opacity    = "0";

    setTimeout(() => {
        splashLogo.style.transition    = "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease, letter-spacing 0.6s ease";
        splashLogo.style.transform     = "scale(2.5)";
        splashLogo.style.letterSpacing = "80px";
        splashLogo.style.opacity       = "0";
    }, 300);

    setTimeout(() => {
        splash.style.transition = "opacity 0.5s ease";
        splash.style.opacity    = "0";
    }, 800);

    setTimeout(() => {
        splash.remove();
        const bgMusic = document.getElementById("bgMusic");
        if (bgMusic && bgMusic.paused) {
            bgMusic.volume = 0.15;
            bgMusic.play();
        }
    }, 1300);

});