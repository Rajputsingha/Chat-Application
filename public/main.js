const socket = io();

const clientsTotal = document.getElementById("client-total");
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

messageForm.addEventListener("submit", (e) => {
  e.preventDefault(); // otherwise it is reload the page
  sendMessage();
});
socket.on("clients-total", (data) => {
  clientsTotal.innerText = `Total Clients: ${data}`;
});

function sendMessage() {
  if (messageInput.value === "") return;
  // console.log(messageInput.value);
  const data = {
    name: nameInput.value,
    messgae: messageInput.value,
    dateTime: new Date(),
  };
  socket.emit("message", data);
  addMessageToUI(true, data);
  messageInput.value = " ";
}
socket.on("chat-message", (data) => {
  console.log(data);
  addMessageToUI(false, data);
});
function addMessageToUI(isOwnMessage, data) {
  clearfeedback();
  const element = `
   <li class="${isOwnMessage ? "message-right" : "message-left"}">
          <p class="messgae">
          ${data.message}
            <span>${data.name}   ${moment(data.dateTime).fromNow()}</span>
          </p>
        </li>
        `;
  messageContainer.innerHTML += element;
  ScroolToBottom();
}
function ScroolToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}
messageInput.addEventListener(" focus", (e) => {
  socket.emit("feedback", {
    feedback: ` ${nameInput.value} is typing message`,
  });
});

messageInput.addEventListener("keypress", (e) => {
  socket.emit("feedback", {
    feedback: ` ${nameInput.value} is typing message`,
  });
});
messageInput.addEventListener("blur", (e) => {
  socket.emit("feedback", {
    feedback: "",
  });
});

socket.on("feedback", (data) => {
  clearfeedback();
  const element = `
    <li class="message-feedback">
          <p class="feedback" id="feedback">${data.feedback}</p>
        </li>
  `;
  messageContainer.innerHTML += element;
});

function clearfeedback() {
  document.querySelectorAll("li.message-feedback").forEach((element) => {
    element.parentNode.removeChild(element);
  });
}
