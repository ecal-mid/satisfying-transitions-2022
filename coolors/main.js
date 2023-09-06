const urls = [
  "1",
  "2",
  "3",
  "4",
]

const sketches = []
let currentSketchId = -1

const main = document.querySelector("main")

const width = 1720
const height = 1080

for (const url of urls) {

  const iframe = document.createElement("iframe")
  let scaleFactor = 1;

  iframe.src = url
  iframe.width = width;
  iframe.height = height;

  main.appendChild(iframe)

  sketches.push({
    url: url,
    iframe: iframe
  })
}

window.onresize = () => {
  const wWidth = window.innerWidth
  const wHeight = window.innerHeight

  const wRatio = wWidth / wHeight
  const ratio = width / height
  let scaleRatio = 1


  // contain
  if (wRatio < ratio) {
    scaleRatio = wWidth / width
  } else {
    scaleRatio = wHeight / height
  }

  document.documentElement.style.setProperty("--ratio", scaleRatio * 1)
}

window.onresize()

setSketch(0)

function setSketch(id) {

  const prev = sketches[currentSketchId]
  if (prev) {
    prev.iframe.classList.remove("selected");
    prev.iframe.src = prev.iframe.src;
  }

  currentSketchId = id
  const newSketch = sketches[currentSketchId]
  if (newSketch) {
    newSketch.iframe.classList.add("selected")
    newSketch.iframe.contentWindow.postMessage("start", "*")
  }
}

function next() {

  const nextId = (currentSketchId + 1) % sketches.length
  setSketch(nextId)

}

window.addEventListener("message", (event) => {
  if (event.data === "finished") {
    console.log("received message to move to next sketch")
    next()
  }
}, false)
