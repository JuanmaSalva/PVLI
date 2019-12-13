let express = require('express');
const app = express(); // servidor de aplicaciones
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = 80;
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

app.get('/game2nd.js', function (req, res) {
  res.sendFile(__dirname + '/game2nd.js');
});

app.use('/jugador', express.static('jugador'));
app.use('/balas', express.static('balas'));
app.use('/assets', express.static('assets'));
app.use('/menus', express.static('menus'));


io.on('connection', socket => {
  console.log('a user connected');
  clients.push(socket);



  clients[0].on('numeroJugador', () => { //simepre existira
    let n = { numero: 0 };
    clients[0].emit('numeroJugador', n);
  });


  if (clients[1]) { //cuando se conecta el segundo jugador
    clients[1].on('numeroJugador', () => {
      let n = { numero: 1 };
      clients[1].emit('numeroJugador', n);
    });
  }



  this.jugadoresEsperando = { jugador1: false, jugador2: false }
  socket.on('empezar', numJugador => { //cuando se le da a empezar partida
    if (clients.length == 2) {
      if (numJugador == 0) this.jugadoresEsperando.jugador1 = true;
      else this.jugadoresEsperando.jugador2 = true;

      console.log(this.jugadoresEsperando);
      if (!this.jugadoresEsperando.jugador1 || !this.jugadoresEsperando.jugador2) {
        socket.emit("respuestaJugadoresEsperando", false); //solo tiene que avisar a uno de los dos
      }
      else {
        clients[0].emit("respuestaJugadoresEsperando", true); //solo tiene que avisar a uno de los dos
        clients[1].emit("respuestaJugadoresEsperando", true); //solo tiene que avisar a uno de los dos
      } //avisa a los dos aun q de momento esto peta (creo)
    }
    else console.log("Falta un jugador por conectarse");
  })


  socket.on('update', data => { //actualiza al jugador 2
    if (clients.length == 2) clients[1].emit('update', data); //se lo envia directo
  })


  socket.on('explosion', data => {
    clients[1].emit('explosion', data);
  })


  socket.on('disconnect', () => {
    console.log('a user disconnected');
    clients.splice(clients.indexOf(socket), 1); // lo sacamos del array
  });
});

http.listen(PORT, () => {
  console.log('Servidor escuchando en el puerto ', PORT);
});