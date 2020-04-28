import React, {useEffect} from 'react';
import Axios from 'axios';
import io from 'socket.io-client';
var socket = io.connect('http://localhost:3001/');

class Chat extends React.Component{

    constructor(props){
        super(props);
        this.send = this.send.bind(this);
        this.state = {
          info: [],
          name: 'anonymous'
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

            socket = io.connect('http://localhost:3001/');
            this.setState({
                socket: socket,
                channel: this.channel
            });
            
            // Connect 이벤트
            socket.on('connect', () => {
                
                var content = document.querySelector('#content');
                this.state.info.map((item) => {
                    content.value += `${item.message}\n`;
                })
                socket.emit('joinRoom', this.state.channel, this.state.name);
            })
        })
    }

    componentDidMount(){
        this.load();
        socket.on('update', (data) => {
            console.log('update');
            var str = `${data}\n`;
            // 객체 추가
            console.log(str);
            document.querySelector('#content').value += str;
        })
    }            
    
    send(){
        var message = document.querySelector('#message');
        var name = this.state.name
        socket.emit('message', {
            message: message.value,
            name: name
        });
        message.value = '';
        // socket.emit('update', ({
        //     message: message
        // }))
    }

    // //room 선택 함수
    // ns = (num) => {
    //     document.querySelector('#content').value = '';
    //     this.state.socket.emit('leaveRoom', this.state.room, this.state.name);
    //     this.state.socket.emit('joinRoom', num, this.state.name);
    //     this.state.room = num;
    // }

    render(){
        return (
            <div>
                <div id="main">
                    <input type="text" id="message" />
                    <button type="button" onClick={this.send}>SEND</button>
                    <textarea id="content" cols="30" rows="10" readOnly></textarea>
                </div>
            </div>
        )
    }
}

export default Chat;