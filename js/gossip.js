// ── LOAD DATA ──
const headline = localStorage.getItem("headline");
const gossip   = localStorage.getItem("gossip");
const image    = localStorage.getItem("image");

if (headline) document.getElementById("headline").textContent = headline;
if (gossip)   document.getElementById("gossipText").textContent = gossip;
if (image)    document.getElementById("previewImage").style.backgroundImage = `url(${image})`;

// ── DOWNLOAD ──
document.getElementById("downloadPostBtn").addEventListener("click", () => {

    const controls = document.getElementById("controlButtons");
    controls.style.visibility = "hidden";

    setTimeout(() => {
        html2canvas(document.getElementById("downloadArea"), {
            backgroundColor: null,
            scale: 3,
            useCORS: true,
            allowTaint: true
        }).then((canvas) => {
            controls.style.visibility = "visible";
            const link = document.createElement("a");
            link.download = "gossip-girl-post.png";
            link.href = canvas.toDataURL("image/png", 1.0);
            link.click();
        });
    }, 50);

});

// ── SPEECH ──
window.addEventListener("load", () => {

    const text = document.getElementById("gossipText").textContent.trim();
    const name = document.getElementById("headline").textContent.trim();

    const fullScript =
`... Hello, Upper East Siders.

${name}.

${text}

You know you love me.

X O X O

Gossip Girl.`;

    function speak() {
        const utterance = new SpeechSynthesisUtterance(fullScript);
        utterance.rate   = 0.75;
        utterance.pitch  = 1.15;
        utterance.volume = 1;

        function setVoiceAndSpeak() {
            const voices = speechSynthesis.getVoices();
            const zira   = voices.find(v => v.name.includes("Zira"));
            if (zira) utterance.voice = zira;
            speechSynthesis.speak(utterance);
        }

        if (speechSynthesis.getVoices().length > 0) {
            setVoiceAndSpeak();
        } else {
            speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
        }
    }

    document.getElementById("speakBtn").addEventListener("click", () => {
        window.speechSynthesis.cancel();
        speak();
    });

});