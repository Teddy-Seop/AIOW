import React from 'react';
import Axios from 'axios';

class Chat extends React.Component{

    constructor(props){
        super(props);
        this.state = {
          info: []
        }
    }

    path = this.props.workspace;
    channel = this.props.channel;

    load = async () => {
        await Axios.get(`http://localhost:3001/api/workspace/${this.path}/${this.channel}`)
        .then((res) => {
            console.log(res.data);
            for(let item of res.data){
                console.log(item);
                this.setState({
                    info: this.state.info.concat(item)
                })
            }
        })
    }

    componentDidMount(){
        this.load();
    }

    render(){
        return (
            <div>
                {
                    this.state.info.map((item) => {
                        return(
                            <div>{item.message}</div>
                        )
                    })
                }
            </div>
        )
    }
}

export default Chat;