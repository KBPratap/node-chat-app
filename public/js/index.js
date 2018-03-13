var socket = io();

socket.on("connect", function() {
  console.log("connected to server");
});

socket.on("disconnect", function() {
  console.log("disconnected from server");
});

socket.on("newMessage", function(message) {
  console.log("newMessage ", message);
  let li = $("<li></li>");
  li.text(`${message.from}: ${message.text}`);
  $("#messages").append(li);
});

socket.on("newLocationMessage", function(message) {
  let li = $("<li></li>");
  let a = $('<a target="_blank">My current location</a>');

  li.text(`${message.from}: `);
  a.attr("href", message.url);

  li.append(a);

  $("#messages").append(li);
});

$("#message-form").on("submit", function(e) {
  e.preventDefault();
  let messageTextbox = $("#message-text");

  socket.emit(
    "createMessage",
    {
      from: "User",
      text: messageTextbox.val()
    },
    function(data) {
      console.log("Got it ", data);
      messageTextbox.val("");
    }
  );
});

let loc = $("#send-location");
loc.on("click", function(e) {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported by your browser.");
  }

  loc.attr("disabled", "disabled").text("Sending location...");

  navigator.geolocation.getCurrentPosition(
    function(position) {
      console.log(position);
      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      loc.removeAttr("disabled").text("Send location");
    },
    function(err) {
      alert("Unable to fetch location.");
      loc.removeAttr("disabled").text("Send location");
    }
  );
});
