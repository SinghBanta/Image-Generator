const key = "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";
const inputText = document.getElementById("input");
const image = document.getElementById("image");
const GenBtn = document.getElementById("btn");
const svg = document.getElementById("svg");
const load = document.getElementById("loading");
const ResetBtn = document.getElementById("reset");
const downloadBtn = document.getElementById("download");

async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",

    {
      headers: {
        Authorization: `Bearer ${key}`,
      },
      method: "POST",
      body: JSON.stringify({ inputs: inputText.value }),
    }
  );

  const result = await response.blob();
  image.style.display = "block";
  load.style.display = "none";
  return result;
}

async function generate() {
  load.style.display = "block";
  query().then((response) => {
    const objectUrl = URL.createObjectURL(response);
    image.src = objectUrl;
    downloadBtn.addEventListener("click", () => download(objectUrl));
  });
}

GenBtn.addEventListener("click", () => {
  generate();
  svg.style.display = "none";
});

inputText.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    generate();
    svg.style.display = "none";
  }
});

ResetBtn.addEventListener("click", () => {
  inputText.value = "";
  window.location.reload();
});

function download(objectUrl) {
  fetch(objectUrl)
    .then((response) => response.blob())
    .then((file) => {
      let a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = new Date().getTime();
      a.click();
    })
    .catch(() => alert("Failed to download"));
}


if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((error) => {
      console.log("Service Worker registration failed:", error);
    });
}

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
  // Prevent the mini-infobar from appearing on mobile
  event.preventDefault();
  // Save the event so it can be triggered later
  deferredPrompt = event;
  // Show the install button
  const installBtn = document.getElementById("install-btn");
  installBtn.style.display = "block";

  installBtn.addEventListener("click", () => {
    // Hide the install button
    installBtn.style.display = "none";
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      deferredPrompt = null;
    });
  });
});