import React, {useEffect} from 'react';
import Axios from 'axios';
import io from 'socket.io-client';
// import '../static/js/socket.js';

class Chat extends React.Component{

    constructor(props){
        super(props);
        this.state = {
          info: [],
          name: 'anonymous',
          room: 1
        }
    }

    path = this.props.workspace;
    channel = this.props.channel;

    load = async () => {
        await Axios.get(`http://localhost:3001/api/workspace/${this.path}/${this.channel}`)
        .then((res) => {
            console.log(res.data)
            for(let item of res.data){
                this.setState({
                    info: this.state.info.concat(item)
                })
            }
            const socket = io.connect('http://localhost:3001');
            // Connect 이벤트
            socket.on('connect', () => {
                this.state.name = prompt("What's your name?");
                console.log(1)
                let num = 1;
                
                var content = document.querySelector('#content');
                this.state.info.map((item) => {
                    content.value += `${item.message}\n`;
                })
                socket.emit('joinRoom', this.state.room, this.state.name);
            })
            this.setState({
                socket: socket,
                room: this.channel
            });
            socket.on('update', (data) => {
                var str = `${data}\n`;
                // 객체 추가
                console.log(str);
                document.querySelector('#content').value += str;
            })
        })
    }

    componentDidMount(){
        this.load();
    }

    // initSocket = () => {
    //     const socket = io.connect('http://localhost:3001');
    //     // Connect 이벤트
    //     socket.on('connect', () => {
    //         this.state.name = prompt("What's your name?");
    //         console.log(1)
    //         let num = 1;
            
    //         var content = document.querySelector('#content');
    //         this.state.info.map((item) => {
    //             content.value += `${item.message}\n`;
    //         })
    //         socket.emit('joinRoom', this.state.room, this.state.name);
    //     })
    //     this.setState({
    //         socket: socket,
    //         room: this.channel
    //     });
    //     socket.on('update', (data) => {
    //         var str = `${data}\n`;
    //         // 객체 추가
    //         console.log(str);
    //         document.querySelector('#content').value += str;
    //     })
    // }
    
    // send 함수
    send = () => {
        var message = document.querySelector('#message');
        document.querySelector('#message').value = '';
        this.state.socket.emit('message', {message: message}) //전송
    }
    
    //room 선택 함수
    ns = (num) => {
        document.querySelector('#content').value = '';
        this.state.socket.emit('leaveRoom', this.state.room, this.state.name);
        this.state.socket.emit('joinRoom', num, this.state.name);
        this.state.room = num;
    }

    render(){
        return (
            <div>
                <div id="main">
                    <input type="text" id="message" />
                    <button type="button" onClick={
                        () => {
                            var message = document.querySelector('#message');
                            document.querySelector('#message').value = '';
                            this.state.socket.emit('message', {message: message}) //전송
                        }
                    }>SEND</button>
                    <textarea id="content" cols="30" rows="10" readOnly></textarea>
                </div>
            </div>
        )
    }
}

export default Chat;