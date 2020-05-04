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
        this.state = {
          info: [],
          channel: 0,
          create: '',
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

    handleOpenModal = () => {
        this.setState({showModal: true});
    }

    handleCloseModal = () => {
        this.setState({showModal: false});
    }

    handleCreate(e){
        this.setState({create:e.target.value})
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
                    <button onClick={this.handleOpenModal}>ADD</button>
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
                    isOpen={this.state.showModal}
                    style={this.state.modalStyle}
                    contentLabel="Example Modal"
                >
                <div>생성할 채널 이름을 입력해주세요</div>
                <input type="text" onChange={this.handleCreate} /><br/>
                <button onClick={event => {
                    this.create();
                    this.handleCloseModal();
                }}>Create</button>
                <button onClick={this.handleCloseModal}>close</button>
                </Modal>
            </div>
        )
    }
}

export default Workspace;