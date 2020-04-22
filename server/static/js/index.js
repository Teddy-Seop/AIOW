const socket = io()
var name = 'anonymous';
// Connect 이벤트
socket.on('connect', () => {
    name = prompt("What's your name?");
    let room = ['room1', 'room2'];
    let num = 0;
    
    socket.emit('joinRoom', num, name);
})

socket.on('update', (data) => {
    var str = `${data}<br>`;
    // 객체 추가
    console.log(str);
    document.querySelector('#content').value += str;
    // document.querySelector('#content').listview('refresh');
})


// send 함수
const send = () => {
    var message = document.querySelector('#message').value
    document.querySelector('#message').value = '';
    socket.emit('message', {message: message}) //전송
}

//room 선택 함수
const ns = (num) => {
    socket.emit('joinRoom', num, name);
    // num++;
    // num %= 2;
    // socket.emit('leaveRoom', num, name);
}