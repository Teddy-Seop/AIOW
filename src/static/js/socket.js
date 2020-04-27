import io from 'socket.io-client';
const socket = io('http://localhost:3001')
var name = 'anonymous';
var room = null;

// Connect 이벤트
socket.on('connect', () => {
    name = prompt("What's your name?");
    console.log(2)
    let num = 1;
    
    socket.emit('joinRoom', num, name);
})

socket.on('update', (data) => {
    var str = `${data}\n`;
    // 객체 추가
    console.log(str);
    document.querySelector('#content').value += str;
})

// send 함수
const send = () => {
    var message = document.querySelector('#message').value
    document.querySelector('#message').value = '';
    socket.emit('message', {message: message}) //전송
}

//room 선택 함수
const ns = (num) => {
    document.querySelector('#content').value = '';
    socket.emit('leaveRoom', room, name);
    socket.emit('joinRoom', num, name);
    room = num;
}