import React from 'react';
import Axios from 'axios';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Chat from './Chat';
import '../css/workspace.css';

class Workspace extends React.Component{

    constructor(props){
        super(props);
        this.state = {
          info: [],
          channel: 0
        }
    }

    path = this.props.match.params.workspace;

    side = async () => {
        await Axios.get(`http://localhost:3001/api/workspace/${this.path}`)
        .then((res) => {
            if(res.data.validate != 'fail'){
                document.querySelector('#name').innerHTML = res.data[0][0].name;
                for(let item of res.data[1]){
                    this.setState({
                        info: this.state.info.concat(item)
                    })
                }
            }else{
                alert('Workspace does not exist');
                this.props.history.push(`/workspace`);
            }
        }
    )}

    channel = (no) => {
        console.log(no);
        this.setState({channel: no});
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
                                    workspace={this.path}
                                    channel={this.state.channel}
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