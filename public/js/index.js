var socket = io();

socket.on("connect", function() {
  console.log("connected to server");
});

socket.on("disconnect", function() {
  console.log("disconnected from server");
});

socket.on("newMessage", function(message) {
  let formattedTime = moment(message.createdAt).format("h:mm a");
  var template = $("#message-template").html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  $("#messages").append(html);
});

socket.on("newLocationMessage", function(message) {
  let formattedTime = moment(message.createdAt).format("h:mm a");
  var template = $("#location-message-template").html();
  var html = Mustache.render(template, {
    text: "My current location",
    from: message.from,
    createdAt: formattedTime,
    url: message.url
  });

  $("#messages").append(html);
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
