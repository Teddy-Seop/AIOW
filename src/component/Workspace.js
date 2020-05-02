import React from 'react';
import Axios from 'axios';
import {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Chat from './Chat';
import '../static/css/workspace.css';

class Workspace extends React.Component{

    constructor(props){
        super(props);
        this.state = {
          info: [],
          channel: 0,
          name: Math.random() * 100
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
            console.log(res);
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
                                    name={this.state.name}
                                />   
                            </div>  
                        ):(
                            <div></div>
                        )
                    }
                </div>
            </div>
        )
    }
}

export default Workspace;