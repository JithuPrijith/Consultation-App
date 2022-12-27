
let socket = io()
var userId = document.getElementById('user-id').value;
var doctorId = document.getElementById('doctor-id').value;

socket.on('connect', () => {
    console.log("connected in client side")

})


// whenever a browser connect it establish a connection with the below sending userid
socket.emit('add-new-user', userId)

// function which calls on submitting a form.
function submitForm() {
    var formInputValue = document.getElementById('input').value;
    data = { userId, text: formInputValue }
    socket.emit('send-message-of-doctor', data)
    document.getElementById('input').value = ""
    return false;
}

// 


