const statusDiv = document.getElementById("status");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const disconnectButton = document.getElementById("disconnect-button");
const notificationsDiv = document.getElementById("notifications");
const wsUrl = "wss://socketsbay.com/wss/v2/1/demo/";
let socket;
let reconnectTimeout;

const displayNotification = (message) => {
  const div = document.createElement("div");
  div.className = "notification";
  div.textContent = message;
  notificationsDiv.appendChild(div);
};

const updateUIConnected = () => {
  statusDiv.textContent = "Connected";
  statusDiv.style.color = "green";
  messageInput.disabled = false;
  sendButton.disabled = false;
  disconnectButton.disabled = false;
};

const updateUIDisconnected = () => {
  statusDiv.textContent = "Disconnected. Reconnecting...";
  statusDiv.style.color = "red";
  messageInput.disabled = true;
  sendButton.disabled = true;
  disconnectButton.disabled = true;
};

const connectWebSocket = () => {
  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    updateUIConnected();
    displayNotification("✅ Connected to WebSocket server");
  };

  socket.onmessage = (event) => {
    displayNotification("🔔 " + event.data);
  };

  socket.onclose = () => {
    updateUIDisconnected();
    displayNotification("⚠️ Connection closed. Trying to reconnect...");
    reconnectTimeout = setTimeout(connectWebSocket, 3000); // Retry in 3 seconds
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
};

sendButton.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message && socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message);
    messageInput.value = "";
  }
});

disconnectButton.addEventListener("click", () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
    clearTimeout(reconnectTimeout);
    statusDiv.textContent = "Disconnected manually";
    statusDiv.style.color = "orange";
    displayNotification("⛔ Disconnected manually");
  }
});

connectWebSocket();
