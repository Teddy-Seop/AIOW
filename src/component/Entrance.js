import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';

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

    create = () => {
        this.props.history.push(`/workspace/create`);
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
                            onClick={this.create}
                        >
                            {"Create Workspace"}
                        </Link>
                    </div>
                </Container>
            </div>
        )
    }
}

export default Entrance;