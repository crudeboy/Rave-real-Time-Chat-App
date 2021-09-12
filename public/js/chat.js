//////////////////////** 
// used moment.js for time manipulation
//used monstache.js for rendering the message to the browser
//using query stringh to get access to the query link sent to the route


//////////

const socket = io()

//Elements
const messageForm = document.querySelector("#message-submit")
const messageFormInput = document.querySelector("input")
const messageFormButton = document.querySelector("button")
const locationButton = document.querySelector("#send-location")
const messages = document.querySelector("#messages")

//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML
const locationTemplate = document.querySelector("#location-template").innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML


//options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true})

const autoscroll = () => {
    //New message element
    const newMessage = messages.lastElementChild

    //Height of the new message
    const newMessageStyles = getComputedStyle(newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    console.log(newMessageMargin)
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin

   //visible height
   const visibleHeight  = messages.offsetHeight
    //what is the offset heigh of a page
    //what is the scroll height
    //


   //Height of message container
   const containerHeight = messages.scrollHeight

   //How far have i scrolled
   const scrollOffset = messages.scrollTop + visibleHeight

   if(containerHeight - newMessageHeight <= scrollOffset){
       messages.scrollTop = messages.scrollHeight
   }
}

socket.on("message", (message) => {

    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll();
                
})

socket.on("locationMessage", (locationObject) => {
    // console.log(locationURL)

    const locationUrl = Mustache.render(locationTemplate, {
        // locationURL
        username: locationObject.username,
        message: locationObject.text,
        createdAt: moment(locationObject.createdAt).format('h:mm a')
    })

    messages.insertAdjacentHTML('beforeend', locationUrl)
    autoscroll();
})

socket.on('roomData', ({room, users} ) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

const messageField = document.querySelector(".message-field")
messageForm .addEventListener("submit", (e) => {
    e.preventDefault()

    messageFormButton.setAttribute('disabled', 'disabled')//to disable the send button slightly for a little while

    let textMessage = e.target.elements.message.value

    socket.emit("textMessage", textMessage, (error) => {
        messageFormButton.removeAttribute('disabled')//To reanable the send attribute t allow for messages to be sent 
        messageFormInput.value = ''
        messageFormInput.focus()

        if(error){
            return console.log(error)
        }

        console.log('The messsage was delivered')
    })

})

locationButton.addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert("Your browser does not support the geolacation services")
    }

    locationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("location", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (status) => {
            locationButton.removeAttribute('disabled')
            console.log(status)
        })

        socket.emit("locationMessage", (message) => {

            console.log(message)
        })
        // console.log(position.coords)
    })

})

socket.emit("join", { username, room }, (error) => {
    if(error){ 
        alert(error)
        location.href = '/'
    }
})