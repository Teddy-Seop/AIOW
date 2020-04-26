import React from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

class Login extends React.Component{

    constructor(props) {
        super(props);
        this.handleId = this.handleId.bind(this);
        this.handlePw = this.handlePw.bind(this);
        this.state = {
          id:'',
          pw:''
        };
    }

    handleId(e){
        this.setState({id:e.target.value})
    }
    handlePw(e){
        this.setState({pw:e.target.value})
    }

    login = () => {
        axios.post('http://localhost:3001/api/login', {
            id: this.state.id, 
            pw: this.state.pw
        })
        .then((res) => {
            console.log(res.data);
            if(res.data.login != 'fail'){
                this.props.history.push("/workspace");
            }else{
                alert('Login Fail');
            }
            
        })
    }

    render(){
        return (
            <div id="center">
            <Container component="main" maxWidth="xs">
                <div>
                <TextField
                    variant="standard"
                    margin="normal"
                    fullWidth
                    label="ID"
                    autoFocus
                    onChange={this.handleId}
                />
                <TextField
                    variant="standard"
                    margin="normal"
                    fullWidth
                    label="PW"
                    onChange={this.handlePw}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="default"
                    onClick={this.login}
                >Sign In
                </Button>
                <Grid container>
                    <Grid item>
                        <Link href="#" variant="body2">
                            {"Sign Up"}
                            </Link>
                            </Grid>
                    </Grid>
                </div>
                </Container>
            </div>
        )
    }
}

export default Login;