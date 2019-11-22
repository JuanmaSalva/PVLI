const app = require('express')();
const http = require('htpp').createServer(app);
const io = require('socket.io)')(http);

const PORT = 3000;
var CLIENTS = [];

app.get('/', function (req, res) {
    res.sendFile('/docs/index.html');
});

io.on('connection', socket => {
    console.log('a user connected');
    clients.push(socket);
});

socket.on('disconnect', () => {
    console.log('a user disconnected');
    clients.splice(clients.indexOf(socket), 1); // lo sacamos del array
});

socket.on('precios', mensaje => {
    let lista =
        mensaje === 'armas' ?
            { espada: 400, escudo: 200 } :
            { naranja: 10, limon: 15 };

    // para enviar algo, usamos `emit`
    // que tiene un nombre de mensaje,
    // y un objeto
    socket.emit('respuesta', lista);
});

http.listen(port, () => {
    console.log('Servidor escuchando en el puerto', port);
  });