import React, {useEffect} from 'react';
import Axios from 'axios';
import io from 'socket.io-client';

var socket = null;
class Chat extends React.Component{

    constructor(props){
        super(props);
        this.send = this.send.bind(this);
        this.upload = this.upload.bind(this);
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
            socket.emit('joinRoom', this.state.channel, this.state.uno);
        })

        socket.on('message', (data) => {
            console.log('message');
            var str = `${data.message}\n`;
            document.querySelector('#content').value += str;
        })

        socket.on('upload', (data) => {
            console.log('upload');
            var str = `${data.message}\n`;
            document.querySelector('#content').value += str;
        })
    }

    componentWillUnmount(){
        socket.emit('leaveRoom', this.state.channel, this.state.uno);
    }
    
    // 메시지 전송
    send(){
        var message = document.querySelector('#message');
        socket.emit('message', {
            message: message.value,
            uno: this.state.uno,
            channel: this.state.channel
        });
        message.value = '';
    }

    // 파일 업로드
    upload(){
        var form = new FormData();
        var file = document.querySelector('#file');
        form.append('file', file.files[0]);
        Axios.post('http://localhost:3001/api/upload', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            params: {
                uno: window.sessionStorage.uno,
                channel: this.state.channel
            }
        })
        .then((res) => {
            console.log(res.data);
            socket.emit('upload', {
                message: file.value,
                uno: this.state.uno,
                channel: this.state.channel
            });
            file.value = '';
        })
    }

    render(){
        return (
            <div>
                <div id="main">
                    <textarea id="content" cols="30" rows="10" readOnly></textarea>
                    <input type="text" id="message" />
                    <button type="button" onClick={this.send}>SEND</button>
                    <form action="upload" method="POST" encType="multipart/form-data">
                        <input type="file" id="file" name="file" />
                        <button type="button" onClick={this.upload}>UPLOAD</button>
                    </form>
                </div>
            </div>
        )
    }
}
export default Chat;