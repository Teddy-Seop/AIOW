const express = require('express');
const http = require('http');
const socket = require('socket.io');
// const redis = require('socket.io-redis');
// const cluster = require('cluster');
// var numCPUs = require('os').cpus().length;
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socket(server);
app.use(bodyParser.json())
app.use('/css', express.static('./static/css'));
app.use('/js', express.static('./static/js'));
app.use(cors());

app.get('/', (req, res) => {
    fs.readFile('./static/index.html', (err, data) => {
        if(err){
            res.send('error');
        }else{
            res.writeHead(200, {'Content-Type':'text/html'});
            res.write(data);
            res.end()
        }
    })
})

app.get('/api', (req, res) => {
    res.json(
        {
            username: "Kim"
        }
    );
})

io.sockets.on('connect', (socket) => {

    var roomName = 1;

    socket.on('message', (data) => {
        data.name = socket.name;
        console.log(data);
        io.sockets.in(roomName).emit('update', data);
        // socket.broadcast.emit('update', data);
    })

    socket.on('joinRoom', (num, name) => {
        roomName = num;
        console.log(`${name} is join ${num}`);
        socket.join(num);
    });

    socket.on('leaveRoom', (num, name) => {
        socket.leave(room[num], () => {
          console.log(name + ' leave a ' + room[num]);
          io.to(room[num]).emit('leaveRoom', num, name);
        });
    });

    socket.on('disconnect', () => {
        console.log(`${socket.name} is disconnected`);
        socket.broadcast.emit('update', {
            type: 'disconnect',
            name: 'SERVER',
            message: `${socket.name} is disconnected`
        });
    })
})

server.listen(3001, () => {
    console.log('express is running on 3001');
})