import React from 'react';
import Axios from 'axios';
import Modal from 'react-modal';
import {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Chat from './Chat';
import '../static/css/workspace.css';

Modal.setAppElement('#root')

class Workspace extends React.Component{

    constructor(props){
        super(props);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleInvite = this.handleInvite.bind(this);
        this.state = {
          info: [],
          channel: 0,
          create: '',
          invite: '',
          modalStyle:{
            content : {
                top                   : '50%',
                left                  : '50%',
                right                 : 'auto',
                bottom                : 'auto',
                marginRight           : '-50%',
                transform             : 'translate(-50%, -50%)'
              }
          }
        }
    }

    path = this.props.match.params.workspace;
    side = async () => {
        await Axios.get(`http://localhost:3001/api/workspace/${this.path}`, {
            params: {
                uno: window.sessionStorage.uno
            }
        })
        .then((res) => {
            if(res.data[0][0].validate == 'success'){
                document.querySelector('#name').innerHTML = res.data[0][0].name;
                for(let item of res.data[1]){
                    this.setState({
                        info: this.state.info.concat(item)
                    })
                }
            }else if(res.data[0][0].validate == 'authority'){
                alert(`${res.data[0][0].message}`);
                this.props.history.push(`/workspace`);
            }else{
                confirmAlert({
                    title: 'test',
                    message: `${res.data[0][0].message}`,
                    buttons: [
                        {
                            label: 'Yes',
                            onClick: () => {
                                Axios.post(`http://localhost:3001/api/workspace`, {
                                    workspace: res.data[0][0].workspace,
                                    uno: window.sessionStorage.uno
                                })
                                .then(() => {
                                    console.log('create');
                                })
                            }
                        },
                        {
                            label: 'No',
                            onClick: () => {
                                this.props.history.push(`/workspace`);
                            }
                        }
                    ]
                });
            }
        }
    )}
    
    channel = (no) => {
        this.setState(() => {
            return {channel: no}
        });
    }

    handleOpenModal1 = () => {
        this.setState({showModal1: true});
    }

    handleCloseModal1 = () => {
        this.setState({showModal1: false});
    }

    handleCreate(e){
        this.setState({create:e.target.value});
    }

    create = () => {
        Axios.post(`http://localhost:3001/api/workspace/channel`, {
            channel: this.state.create,
            wname: this.path
        })
        .then((res) => {
            console.log(`Create Channel ${res.no}`);
            this.setState({info: []})
            this.side();
            console.log(this.state.info);
        })
    }

    handleOpenModal2 = () => {
        this.setState({showModal2: true});
    }

    handleCloseModal2 = () => {
        this.setState({showModal2: false});
    }

    handleInvite(e){
        this.setState({invite: e.target.value});
    }

    invite = () => {
        Axios.get(`http://localhost:3001/api/user`, {
            params: {
                id: this.state.invite
            }
        })
        .then((res) => {
            console.log(res.data);
            if(res.data.length){
                Axios.post(`http://localhost:3001/api/user/workspace`, {
                    name: this.state.invite,
                    workspace: this.path
                })
                .then((res) => {
                    console.log(res);
                })
            }else{
                alert('존재하지 않는 사용자입니다.')
            }
        })
    }

    componentDidMount(){
        this.side();
    }

    render(){
        return(
            <div>
                <div id="side">
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={false}
                    aria-label="Vertical tabs example"
                >
                    {
                        this.state.info.map((item) => {
                            return (
                                <Tab
                                    key={item.no}
                                    label={item.name}
                                    values={item.no}
                                    onClick={() => this.channel(item.no)}
                                />
                            )
                        })
                    }
                    <button onClick={this.handleOpenModal1}>ADD CHANNEL</button>
                    <button onClick={this.handleOpenModal2}>Invite</button>
                </Tabs>
                </div>
                <div id="center">
                    <h1 id="name"></h1>
                    <div id="target"></div>
                    {
                        this.state.channel != 0 ? (
                            <div>
                                <Chat
                                    key={this.state.channel}
                                    workspace={this.path}
                                    channel={this.state.channel}
                                    name={window.sessionStorage.name}
                                />   
                            </div>  
                        ):(
                            <div></div>
                        )
                    }
                </div>
                <Modal
                    isOpen={this.state.showModal1}
                    style={this.state.modalStyle}
                    contentLabel="Example Modal"
                >
                <div>생성할 채널 이름을 입력해주세요</div>
                <input type="text" onChange={this.handleCreate} /><br/>
                <button onClick={event => {
                    this.create();
                    this.handleCloseModal();
                }}>Create</button>
                <button onClick={this.handleCloseModal1}>close</button>
                </Modal>
                <Modal
                    isOpen={this.state.showModal2}
                    style={this.state.modalStyle}
                    contentLabel="Example Modal"
                >
                <div>초대할 ID를 입력해주세요</div>
                <input type="text" onChange={this.handleInvite} /><br/>
                <button onClick={event => {
                    this.invite();
                    this.handleCloseModal2();
                }}>Create</button>
                <button onClick={this.handleCloseModal2}>close</button>
                </Modal>
            </div>
        )
    }
}

export default Workspace;