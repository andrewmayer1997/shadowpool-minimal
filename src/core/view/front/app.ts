const client = new WebSocket("ws://localhost:2002", "tcp");
document.head.style.cssText = `@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap');`;
document.body.style.background = "black";
document.body.style.textAlign = "left";
document.body.style.color = "green";

const container = document.createElement("div");
container.id = "container";
document.body.appendChild(container);

function createLogMsg(data) {
  //@ts-ignore
  if (data=="\n") {
    document.getElementById("container").innerHTML = ``;
  } else {
    const p = document.createElement("div");
    p.innerHTML = `<p> ${data} </p>`;
    p.className = `log-msg`;
    p.style.padding = "8px";
    p.style.textAlign = "left";
    p.style.cssText = `font-family: 'Source Code Pro', monospace;`;
    document.getElementById("container").appendChild(p);
  }
}

client.addEventListener("open", function (event) {
  createLogMsg("Start...");
});

client.addEventListener("message", (data) => {
  createLogMsg(data.data);
});
