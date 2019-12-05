let express = require('express');
const app = express(); // servidor de aplicaciones
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = 3000;
var clients = [];


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/game.css', function (req, res) {
  res.sendFile(__dirname + '/game.css');
});

app.get('/game.js', function (req, res) {
  res.sendFile(__dirname + '/game.js');
});

app.get('/constantes.js', function (req, res) {
  res.sendFile(__dirname + '/constantes.js');
});

app.get('/phaser.min.js', function (req, res) {
  res.sendFile(__dirname + '/phaser.min.js');
});

app.use('/jugador', express.static('jugador'));
app.use('/balas', express.static('balas'));
app.use('/assets', express.static('assets'));
app.use('/menus', express.static('menus'));


io.on('connection', socket => {
  console.log('a user connected');
  clients.push(socket);

  clients[0].on('numeroJugador', mensaje => {
    let n={numero:0};
    clients[0].emit('numeroJugador', n);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected');
    clients.splice(clients.indexOf(socket), 1); // lo sacamos del array
  });
});

http.listen(PORT, () => {
  console.log('Servidor escuchando en el puerto ', PORT);
});