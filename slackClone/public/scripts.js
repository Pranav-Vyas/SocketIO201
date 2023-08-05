
const username = "pranav";
const password = "abc";

const socket = io("http://localhost:9000");

socket.on("connect", () => {
  console.log("connected");
  socket.emit("clientConnect");
})

const nameSpaceSockets = [];
const listeners = {
  nsChange: [],
  messageToRoom: []
};

let selectedNsId = 0;

document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const newMessage = document.querySelector("#user-message").value;
  console.log(newMessage, selectedNsId);
  nameSpaceSockets[selectedNsId].emit("newMessageToRoom", {
    newMessage,
    date: Date.now(),
    avatar: "https://via.placeholder.com/30",
    username,
    selectedNsId
  });

  document.querySelector("#user-message").value = "";
})

const addListener = (nsId) => {
  if (!listeners.nsChange[nsId]) {
    nameSpaceSockets[nsId].on("nsChange", (data) => {
      console.log("namespace changed");
      console.log(data);
    })
    listeners.nsChange[nsId] = true;
  }

  if (!listeners.messageToRoom[nsId]) {
    nameSpaceSockets[nsId].on("messageToRoom", messageObj => {
      document.querySelector("#messages").innerHTML += buildMessageHtml(messageObj);
    })
    listeners.messageToRoom[nsId] = true;
  }
}

//lisen for the nsList event from the server which gives us the namespaces
socket.on('nsList', (nsData) => {
  console.log(nsData);
  const nameSapcesDiv = document.querySelector('.namespaces');
  nameSapcesDiv.innerHTML = "";
  nsData.forEach(ns => {
    //update the HTML with each ns
    nameSapcesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`;
    if (!nameSpaceSockets[ns.id]) {
      // join this namespace
      nameSpaceSockets[ns.id] = io(`http://localhost:9000${ns.endpoint}`);
    }
    addListener(ns.id)
  })


  Array.from(document.getElementsByClassName('namespace')).forEach(element => {
    element.addEventListener('click', e => {
      joinNs(element, nsData)
    })
  })

  joinNs(document.getElementsByClassName('namespace')[0], nsData)
})

const buildMessageHtml = (messageObj) => {
  return `
    <li>
      <div class="user-image">
          <img src="${messageObj.avatar}" />
      </div>
      <div class="user-message">
          <div class="user-name-time">${messageObj.username} <span>${new Date(messageObj.date).toLocaleDateString()}</span></div>
          <div class="message-text">${messageObj.newMessage}</div>
      </div>
    </li>
  `
}