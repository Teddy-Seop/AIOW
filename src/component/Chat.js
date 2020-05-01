import React, {useEffect} from 'react';
import Axios from 'axios';
import io from 'socket.io-client';
var socket = null;
class Chat extends React.Component{

    constructor(props){
        super(props);
        this.send = this.send.bind(this);
        this.state = {
          info: [],
          uno: window.sessionStorage.getItem('uno'),
          channel: this.props.channel
        }
    }

    path = this.props.workspace;
    channel = this.props.channel;

    componentDidMount(){
        socket = io.connect('http://localhost:3001/');
        Axios.get(`http://localhost:3001/api/workspace/${this.path}/${this.channel}`)
        .then((res) => {
            console.log(res.data)
            this.setState({
                info: res.data
            })
            var content = document.querySelector('#content');
            this.state.info.map((item) => {
                content.value += `${item.message}\n`;
            })
        })
        // Connect 이벤트
        socket.on('connect', () => {
            var content = document.querySelector('#content');
            console.log(this.state.info);
            this.state.info.map((item) => {
                content.value += `${item.message}\n`;
            })
            socket.emit('joinRoom', this.state.channel, this.state.name);
        })
        socket.on('update', (data) => {
            console.log('update');
            var str = `${data.message}\n`;
            document.querySelector('#content').value += str;
        })
    }

    componentWillUnmount(){
        socket.emit('leaveRoom', this.state.channel, this.state.name);
    }
    
    send(){
        var message = document.querySelector('#message');
        socket.emit('message', {
            message: message.value,
            uno: this.state.uno,
            channel: this.state.channel
        });
        message.value = '';
    }

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