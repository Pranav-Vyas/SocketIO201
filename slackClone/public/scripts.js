const socket = io("http://localhost:9000");

socket.on("connect", () => {
  console.log("connected");
  socket.emit("clientConnect");
})

const nameSpaceSockets = [];
const listeners = {
  nsChange: []
};

const addListener = (nsId) => {
  if (!listeners.nsChange[nsId]) {
    nameSpaceSockets[nsId].on("nsChange", (data) => {
      console.log("namespace changed");
      console.log(data);
    })
    listeners.nsChange[nsId] = true;
  }
}

//lisen for the nsList event from the server which gives us the namespaces
socket.on('nsList',(nsData)=>{
  console.log(nsData);
  const nameSapcesDiv = document.querySelector('.namespaces');
  nameSapcesDiv.innerHTML = "";
  nsData.forEach(ns=>{
      //update the HTML with each ns
      nameSapcesDiv.innerHTML +=  `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`;
      if (!nameSpaceSockets[ns.id]) {
        // join this namespace
        nameSpaceSockets[ns.id] = io(`http://localhost:9000${ns.endpoint}`);
      }
      addListener(ns.id)
  })


  Array.from(document.getElementsByClassName('namespace')).forEach(element=>{
      element.addEventListener('click',e=>{
        joinNs(element, nsData)
      })
  })

  joinNs(document.getElementsByClassName('namespace')[0], nsData)
})