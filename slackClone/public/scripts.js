const socket = io("http://localhost:9000");

socket.on("connect", () => {
  console.log("connected");
  socket.emit("clientConnect");
})


//lisen for the nsList event from the server which gives us the namespaces
socket.on('nsList',(nsData)=>{
  console.log(nsData);
  const nameSapcesDiv = document.querySelector('.namespaces');
  nsData.forEach(ns=>{
      //update the HTML with each ns
      nameSapcesDiv.innerHTML +=  `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`
  })

  Array.from(document.getElementsByClassName('namespace')).forEach(element=>{
      console.log(element)
      element.addEventListener('click',e=>{
        joinNs(element, nsData)
      })
  })

  joinNs(document.getElementsByClassName('namespace')[0], nsData)
})