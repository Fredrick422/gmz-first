"use-strict"

const Server = use('Server')
const socketio = require('socket.io')(Server.getInstance())


module.exports = socketio