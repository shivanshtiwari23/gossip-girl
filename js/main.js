// Elements

const imageUpload = document.getElementById("imageUpload");
const titleInput = document.getElementById("titleInput");
const storyInput = document.getElementById("storyInput");

const headline = document.getElementById("headline");
const gossipText = document.getElementById("gossipText");
const previewImage = document.getElementById("previewImage");

const generateBtn = document.getElementById("generateBtn");

// Generate Gossip Blast

generateBtn.addEventListener("click", () => {

    // Update headline

    if(titleInput.value.trim() !== ""){

        headline.textContent =
            titleInput.value;
    }

    // Update story

    if(storyInput.value.trim() !== ""){

        gossipText.textContent =
            storyInput.value;
    }

    // Update image

    const file =
        imageUpload.files[0];

    if(file){

        const reader =
            new FileReader();

        reader.onload = function(event){

            previewImage.src =
                event.target.result;
        };

        reader.readAsDataURL(file);
    }

});
// Download Gossip Blast

const downloadBtn =
    document.getElementById("downloadBtn");

downloadBtn.addEventListener("click", () => {

    console.log("Download clicked");

    const area = document.body;

    console.log("Area:", area);

    html2canvas(area)
        .then((canvas) => {

            console.log("Canvas created");

            const link = document.createElement("a");

            link.download = "gossip-girl-blast.png";

            link.href = canvas.toDataURL("image/png");

            console.log("Download starting");

            link.click();

        })
        .catch((error) => {

            console.error("html2canvas error:", error);

        });

});