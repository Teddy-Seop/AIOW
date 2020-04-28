var express = require('express');
var router = express.Router();
const http = require('http');
const socket = require('socket.io');
const server = http.createServer(express);
const io = socket(server);
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1111',
  port: '3306',
  database: 'aiow',
  multipleStatements: true
})

router.get("/:workspace", (req, res) => {
  
  var sql1 = `SELECT * FROM workspace WHERE name="${req.params.workspace}";`;
  var sql2 = `SELECT * FROM channel WHERE workspace_no = (SELECT no FROM workspace WHERE name="${req.params.workspace}");`
  connection.query(sql1 + sql2, (err, rows) => {
    if(err) throw err;
    console.log(rows);
    if(rows[0] != null){
      rows[0].validate = 'success';
      res.json(rows);
    }else{
      res.json({validate: 'fail'});
    }
  })
})

router.get("/:workspace/:channel", (req, res) => {
  var channel = req.params.channel;
  console.log(`channel : ${channel}`);
  var sql = `SELECT * FROM message WHERE channel_no=${channel}`;
  connection.query(sql, (err, rows) => {
    if(err) throw err;

    res.json(rows);
  })
})

io.sockets.on('connect', (socket) => {
  console.log(`user : ${socket.client.id}`);
  var room = 1;

  socket.on('message', (data) => {
      console.log(data);
      console.log(room);
      io.sockets.in(room).emit('update', data);
  })

  socket.on('joinRoom', (num, name) => {
      roomName = num;
      console.log(`${name} is join ${num}`);
      socket.join(num);
  });

  socket.on('leaveRoom', (num, name) => {
      socket.leave(num, () => {
        console.log(name + ' leave a ' + num);
        io.to(num).emit('leaveRoom', num, name);
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

module.exports = router;