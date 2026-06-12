const themeToggle = document.getElementById("themeToggle");
const themeLink   = document.getElementById("themeLink");

const savedTheme = localStorage.getItem("theme") || "dark";

function applyTheme(theme) {
    if (theme === "pink") {
        themeLink.href = "css/theme-pink.css";
        themeToggle.textContent = "🌙";
    } else {
        themeLink.href = "";
        themeToggle.textContent = "💋";
    }
    localStorage.setItem("theme", theme);
}

applyTheme(savedTheme);

themeToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const current = localStorage.getItem("theme") || "dark";
    applyTheme(current === "dark" ? "pink" : "dark");
});