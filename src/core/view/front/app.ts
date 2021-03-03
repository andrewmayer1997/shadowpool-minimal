const client = new WebSocket("ws://localhost:2002", 'tcp')

client.addEventListener('open', function (event) {
  const p = document.createElement("div");
  p.innerHTML = `<p>Socket open...</p>`;
  document.body.appendChild(p);
});

client.addEventListener("message", (data)=>{
  const p = document.createElement("div");
  p.innerHTML = `<p>${data.data}</p>`;
  document.body.appendChild(p);
})
