const joinNs = (element, nsData) => {
  const nsEndpoint = element.getAttribute('ns');
  console.log(nsEndpoint);

  const clickedNs = nsData.find(row => row.endpoint === nsEndpoint);
  const rooms = clickedNs.rooms;

  selectedNsId = clickedNs.id;

  //get the room-list div
  let roomList = document.querySelector('.room-list');
  //clear it out
  roomList.innerHTML = "";

  let firstRoom;
  //loop through each room, and add it to the DOM
  rooms.forEach((room, i) => {
    if (i === 0) {
      firstRoom = room.roomTitle;
    }
    roomList.innerHTML += `<li class="room" namespaceId=${room.namespaceId}>
    <span class="fa-solid fa-${room.privateRoom ? 'lock' : 'globe'}"></span>
    ${room.roomTitle}
    </li>`
  })

  joinRoom(firstRoom, clickedNs.id);

  const roomNodes = document.querySelectorAll(".room");
  Array.from(roomNodes).forEach((elem => {
    elem.addEventListener("click", (e) => {
      const namespaceId = elem.getAttribute("namespaceId");
      joinRoom(e.target.innerText, namespaceId);
    })
  }))
}