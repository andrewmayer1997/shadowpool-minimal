const client = new WebSocket("ws://localhost:2002", "tcp");
document.head.style.cssText = `@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap');`;
document.body.style.background = "black";
document.body.style.textAlign = "left";
document.body.style.color = "green";

const container = document.createElement("div");
container.id = "container";
document.body.appendChild(container);

const buffer = document.createElement("div");
buffer.id = "buffer";
container.appendChild(buffer);

function createLogMsg(data) {
  const p = document.createElement("div");
  p.innerHTML = `<p> ${data} </p>`;
  p.className = `log-msg`;
  p.style.padding = "8px";
  p.style.textAlign = "left";
  p.style.cssText = `font-family: 'Source Code Pro', monospace;`;
  p.style.color = "white";
  buffer.appendChild(p);
}

client.addEventListener("open", function (event) {
  createLogMsg("Start...");
});

client.addEventListener("message", (data) => {
  createLogMsg(data.data);
});
