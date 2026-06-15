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
document.getElementById('uploadPostBtn').addEventListener('click', async () => {
    const headline = document.getElementById('headline').innerText;
    const gossipText = document.getElementById('gossipText').innerText;

    // Get the background image URL from the preview div
    const previewDiv = document.getElementById('previewImage');
    const bgImage = previewDiv.style.backgroundImage;
    const imageUrl = bgImage.slice(5, -2); // strips url(" and ")

    // Fetch the image as a blob
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Compress image before upload
    const compressed = await compressImage(blob);

    const formData = new FormData();
    formData.append('image', compressed, 'gossip.jpg');
    formData.append('headline', headline);
    formData.append('gossipText', gossipText);
    formData.append('postType', 'GOSSIP');

    try {
        const res = await fetch('https://gossip-girl-api-production.up.railway.app/posts/upload', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        if (res.ok) {
            alert('Your gossip is live. XOXO 💋');
        } else {
            alert('Failed to post. Try again.');
        }
    } catch (err) {
        alert('Something went wrong. XOXO');
        console.error(err);
    }
});

async function compressImage(blob) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxWidth = 800;
            const scale = Math.min(1, maxWidth / img.width);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(resolve, 'image/jpeg', 0.7);
        };
        img.src = URL.createObjectURL(blob);
    });
}