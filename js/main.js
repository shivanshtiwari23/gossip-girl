// =========================
// GENERATOR PAGE
// =========================

const generateBtn = document.getElementById("generateBtn");

if (generateBtn) {

    const imageUpload =
        document.getElementById("imageUpload");

    const headlineInput =
        document.getElementById("headlineInput");

    const gossipInput =
        document.getElementById("gossipInput");

    generateBtn.addEventListener("click", () => {

        const file =
            imageUpload.files[0];

        if (!file) {

            alert("Please upload an image first.");

            return;
        }

        const reader =
            new FileReader();

       reader.onload = function (event) {

    // compress image before storing
    const img = new Image();
    img.src = event.target.result;

    img.onload = function () {

        const canvas = document.createElement("canvas");

        // max width 800px to keep size small
        const maxWidth = 800;
        const scale    = Math.min(1, maxWidth / img.width);

        canvas.width  = img.width  * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressed = canvas.toDataURL("image/jpeg", 0.7);

        localStorage.setItem("headline", headlineInput.value);
        localStorage.setItem("gossip",   gossipInput.value);
        localStorage.setItem("image",    compressed);

        window.location.href = "gossip.html";
    };

};

        reader.readAsDataURL(file);

    });

}