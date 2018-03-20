var socket = io();

//scrollHeight - total height of the page
//clientHeight - total height of the visible area
//scrollTop
function scrollToBottom() {
  // Selectors
  var messages = $("#messages");
  var newMessage = messages.children("li:last-child");
  // Heights
  var clientHeight = messages.prop("clientHeight");
  var scrollTop = messages.prop("scrollTop");
  var scrollHeight = messages.prop("scrollHeight");
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (
    clientHeight + scrollTop + lastMessageHeight + newMessageHeight >=
    scrollHeight
  ) {
    console.log("Should scroll");
    messages.scrollTop(scrollHeight);
  }
}

socket.on("connect", function() {
  // console.log("connected to server");
  var params = $.deparam(window.location.search);
  socket.emit("join", params, function(err) {
    if (err) {
      alert(err);
      window.location.href = "/";
    } else {
      console.log("no error");
    }
  });
});

socket.on("disconnect", function() {
  console.log("disconnected from server");
});

socket.on("updateUserList", function(users) {
  console.log("Users list", users);
  var ol = $("<ol></ol>");
  users.forEach(function(user) {
    ol.append($("<li></li>").text(user));
  });
  $("#users").html(ol);
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
  scrollToBottom();
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
  scrollToBottom();
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
