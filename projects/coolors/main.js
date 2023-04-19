const urls = ["1", "2", "3", "4"];

const sketches = [];
let currentSketchId = -1;

const main = document.querySelector("main");

for (const url of urls) {
  const iframe = document.createElement("iframe");
  iframe.src = url;

  main.appendChild(iframe);

  sketches.push({
    url: url,
    iframe: iframe,
  });
}

setSketch(0);

function setSketch(id) {
  const prev = sketches[currentSketchId];
  if (prev) {
    prev.iframe.style = "z-index:-99";
    prev.iframe.src = prev.iframe.src;
  }

  currentSketchId = id;

  const newSketch = sketches[currentSketchId];
  if (newSketch) {
    newSketch.iframe.style = "z-index:99;";
  }
}

function next() {
  const nextId = (currentSketchId + 1) % sketches.length;
  setSketch(nextId);
}

window.addEventListener(
  "message",
  (event) => {
    if (event.data === "finished") {
      console.log("received message to move to next sketch");
      next();
    }
  },
  false
);
