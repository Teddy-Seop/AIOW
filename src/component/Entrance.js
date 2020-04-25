import React from 'react';

class Entrance extends React.Component{

    constructor(props) {
        super(props);
        this.handleWorkspace = this.handleWorkspace.bind(this);
        this.state = {
          workspace:''
        };
    }

    handleWorkspace(e){
        this.setState({workspace:e.target.value})
    }

    workspace = () => {
        this.props.history.push(`/workspace/${this.state.workspace}`);
    }

    render(){
        return (
            <div>
                Workspace <input type="text" id="workspace" onChange={this.handleWorkspace} /><br/>
                <button type="button" onClick={this.workspace}>Enter</button>
            </div>
        )
    }
}

export default Entrance;