const express = require('express');
const http = require('http');
const socket = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = socket(server);
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1111',
    port: '3306',
    database: 'aiow'
})

app.use(bodyParser.json())
app.use('/css', express.static('./static/css'));
app.use('/js', express.static('./static/js'));
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));

const userRouter = require('./router/user');
const workspaceRouter = require('./router/workspace');
app.use('/api', userRouter);
app.use('/api/workspace', workspaceRouter);

app.get('/', (req, res) => {

    res.render('./static/index');
})

io.sockets.on('connect', (socket) => {
    var room = 1;

    socket.on('message', (data) => {
        console.log(data);
        console.log(socket.rooms);
        //socket.broadcast.emit('update', data);
        io.sockets.in(room).emit('update', data);
    })

    socket.on('joinRoom', (num, name) => {
        room = num;
        console.log(`${name} is join ${room}`);
        socket.join(room);
    });

    socket.on('leaveRoom', (num, name) => {
        socket.leave(num, () => {
          console.log(name + ' leave a ' + num);
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