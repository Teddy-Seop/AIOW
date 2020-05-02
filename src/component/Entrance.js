import React from 'react';
import Axios from 'axios';
import Modal from 'react-modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import '../static/css/modal.css';

Modal.setAppElement('#root')

class Entrance extends React.Component{

    constructor(props) {
        super(props);
        this.handleWorkspace = this.handleWorkspace.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.state = {
          workspace:'',
          create:'',
          modalStyle:{
            content : {
                top                   : '50%',
                left                  : '50%',
                right                 : 'auto',
                bottom                : 'auto',
                //marginRight           : '-50%',
                transform             : 'translate(-50%, -50%)'
              }
          }
        };
    }

    handleWorkspace(e){
        this.setState({workspace:e.target.value})
    }

    workspace = () => {
        this.props.history.push(`/workspace/${this.state.workspace}`);
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
        Axios.post(`http://localhost:3001/api/workspace`, {
            workspace: this.state.create,
            uno: window.sessionStorage.uno
        })
        .then(()=> {
            console.log('test');
        })
    }

    render(){
        return (
            <div id="center">
                <Container component="main" maxWidth="xs">
                    <div>
                        Workspace
                        <br />
                        <TextField
                            id="standard-basic"
                            onChange={this.handleWorkspace}
                        />
                        <br /><br />
                        <Button 
                            variant="contained"
                            onClick={this.workspace}
                        >
                            Enter
                        </Button>
                        <br />
                        <Link 
                            href="#" 
                            variant="body2"
                            onClick={this.handleOpenModal}
                        >
                            {"Create Workspace"}
                        </Link>
                    </div>
                </Container>
                <div>
                    <Modal
                        isOpen={this.state.showModal}
                        style={this.state.modalStyle}
                        contentLabel="Example Modal"
                    >
                    <div>I am a modal</div>
                    <form>
                        <input type="text" onChange={this.handleCreate} /><br/>
                        <button onClick={this.create}>Create</button>
                        <button onClick={this.handleCloseModal}>close</button>
                    </form>
                    </Modal>
                </div>
            </div>
        )
    }
}

export default Entrance;