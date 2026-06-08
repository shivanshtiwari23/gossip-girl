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

            localStorage.setItem(
                "headline",
                headlineInput.value
            );

            localStorage.setItem(
                "gossip",
                gossipInput.value
            );

            localStorage.setItem(
                "image",
                event.target.result
            );

            window.open(
                "gossip.html",
                "_blank"
            );

        };

        reader.readAsDataURL(file);

    });

}