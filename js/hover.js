const hoverSound = document.getElementById("hoverSound");

const hoverItems = document.querySelectorAll(".left-menu section, .menu-item");
const buttonItems = document.querySelectorAll(".tip-link");

buttonItems.forEach(btn => {
    btn.addEventListener("mouseenter", () => {
        hoverSound.currentTime = 0;
        hoverSound.volume = 1.0;
        hoverSound.play();
    });
});

hoverItems.forEach(item => {
    item.addEventListener("mouseenter", () => {
        hoverSound.currentTime = 0;
        hoverSound.volume = 1.0;
        hoverSound.play();

        item.style.transform  = "translateY(-4px) scale(1.8) translateZ(20px)";
        item.style.transition = "transform 0.2s ease, text-shadow 0.2s ease, filter 0.2s ease";
        item.style.textShadow = "0 0 12px currentColor, 0 0 30px currentColor";
        item.style.filter     = "brightness(1.4)";
        item.style.cursor     = "pointer";
    });

    item.addEventListener("mouseleave", () => {
        item.style.transform  = "translateY(0) scale(1) translateZ(0)";
        item.style.textShadow = "none";
        item.style.filter     = "brightness(1)";
    });
});
const feedNavItems = document.querySelectorAll(".feed-nav-item");

feedNavItems.forEach(item => {
    item.addEventListener("mouseenter", () => {
        hoverSound.currentTime = 0;
        hoverSound.volume = 1.0;
        hoverSound.play();
    });

    item.addEventListener("mouseleave", () => {});
});
feedNavItems.forEach(item => {
    item.addEventListener("mouseenter", () => {
        hoverSound.currentTime = 0;
        hoverSound.volume = 1.0;
        hoverSound.play();

        item.style.transform  = "translateX(4px)";
        item.style.transition = "transform 0.2s ease, filter 0.2s ease";
        item.style.filter     = "brightness(1.4)";
        item.style.cursor     = "pointer";
    });

    item.addEventListener("mouseleave", () => {
        item.style.transform = "translateX(0)";
        item.style.filter    = "brightness(1)";
    });
});
const circles = document.querySelectorAll(".circle");

circles.forEach(circle => {
    circle.addEventListener("mouseenter", () => {
        hoverSound.currentTime = 0;
        hoverSound.volume = 1.0;
        hoverSound.play();

        circle.style.transition = "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease";
        circle.style.transform  = "translateY(-8px) scale(1.5)";
        circle.style.boxShadow  = "0 0 20px #d7cd8c, 0 0 40px #d7cd8c";
    });

    circle.addEventListener("mouseleave", () => {
        circle.style.transform = "translateY(0) scale(1)";
        circle.style.boxShadow = "none";
    });
});

const logo = document.querySelector(".logo");

if (logo) {
    logo.addEventListener("mouseenter", () => {
        hoverSound.currentTime = 0;
        hoverSound.volume = 1.0;
        hoverSound.play();

        logo.style.transition    = "transform 0.3s ease, text-shadow 0.3s ease, letter-spacing 0.3s ease";
        logo.style.transform     = "scale(1.03) translateY(-4px)";
        logo.style.textShadow    = "0 0 15px #efe7b0, 0 0 30px rgba(239,231,176,0.4)";
        logo.style.letterSpacing = "-4px";
        logo.style.cursor        = "default";
    });

    logo.addEventListener("mouseleave", () => {
        logo.style.transform     = "scale(1) translateY(0)";
        logo.style.textShadow    = "none";
        logo.style.letterSpacing = "-8px";
    });
}

const card = document.querySelector(".post-card");

if (card) {
    card.addEventListener("mouseenter", () => {
        hoverSound.currentTime = 0;
        hoverSound.volume = 1.0;
        hoverSound.play();

        card.style.transition  = "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease";
        card.style.transform   = "translateY(-16px) scale(1.35)";
        card.style.boxShadow   = "0 30px 80px rgba(0,0,0,0.7), 0 0 30px #d7cd8c, 0 0 60px rgba(215,205,140,0.4)";
        card.style.zIndex      = "10";
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0) scale(1)";
        card.style.boxShadow = "none";
        card.style.zIndex    = "1";
    });
}