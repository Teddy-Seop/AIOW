import React from 'react';
import Axios from 'axios';
import { RouteProps } from 'react-router';

class Workspace extends React.Component{

    componentDidMount(){
        var path = this.props.match.params.workspace;
        Axios.get(`http://localhost:3001/api/workspace/${path}`)
        .then((res) => {
            if(res.data.validate != 'fail'){
                console.log(res.data);
                document.querySelector('#name').innerHTML = res.data.name;
            }else{
                alert('Workspace does not exist');
                this.props.history.push(`/workspace`);
            }
        })
    }

    render(){
        return(
            <div id="target">
                <h1 id="name"></h1>
            </div>
        )
    }
}

export default Workspace;