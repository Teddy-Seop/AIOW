import React from 'react';
import './App.css';

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      username:null
    }
  }

  componentDidMount(){
    fetch('http://localhost:3001/api')
      .then(res => res.json())
      .then(data => this.setState({username: data.username}))
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          {this.state.username ? `Hello ${this.state.username}` : 'Hello World'}
        </header>
      </div>
    );
  }
}

export default App;