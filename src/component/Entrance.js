import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

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
            <div id="center">
                Workspace 
                <TextField
                    id="standard-basic"
                    onChange={this.handleWorkspace}
                /><br></br>
                <Button 
                    variant="contained"
                    onClick={this.workspace}
                >
                    Enter
                </Button>
            </div>
        )
    }
}

export default Entrance;