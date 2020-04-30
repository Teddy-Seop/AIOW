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
          name: this.props.name,
          channel: this.props.channel
        }
    }

    path = this.props.workspace;
    channel = this.props.channel;

    // componentWillMount(){
    //     socket = io.connect('http://localhost:3001/');
    // }

    componentDidMount(){
        socket = io.connect('http://localhost:3001/');
        Axios.get(`http://localhost:3001/api/workspace/${this.path}/${this.channel}`)
        .then((res) => {
            console.log(`load`);
            console.log(res.data)
            for(let item of res.data){
                this.setState({
                    info: this.state.info.concat(item)
                })
            }
        })
        // Connect 이벤트
        socket.on('connect', () => {          
            console.log(`connect`);
            var content = document.querySelector('#content');
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
        var name = this.state.name
        socket.emit('message', {
            message: message.value,
            name: name
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