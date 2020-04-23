import React from 'react';
import axios from 'axios';

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
            this.props.history.push("/test");
        })
    }

    render(){
        return (
            <div>
                <form >
                    ID <input type="text" id="id" onChange={this.handleId} /><br/>
                    PW <input type="password" id="pw" onChange={this.handlePw} /><br/>
                    <button type="button" onClick={this.login}>LOGIN</button>
                </form>
            </div>
        )
    }
}

export default Login;