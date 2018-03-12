var socket = io();

socket.on('connect', function() {
    console.log('connected to server')
})

socket.on('disconnect', function() {
    console.log('disconnected from server')
})

socket.on('newMessage', (message) => {
    console.log('newMessage ', message);
    let li = $('<li></li>')
    li.text(`${message.from}: ${message.text}`)
    $('#messages').append(li)
})

$('#message-form').on('submit', function(e){
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: $('#message-text').val()
    }, (data) => {
        console.log('Got it ', data);
        $('#message-text').val('')
    })
})

let loc = $('#send-location')
loc.on('click', function(e){
    if(! navigator.geolocation) {
        return alert('Geolocation not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition(function(position) {
        console.log(position)
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function (err) {
        alert('Unable to fetch location.')
    })

})