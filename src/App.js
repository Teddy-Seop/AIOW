import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Login, Test } from './component';
import './App.css';

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      username:null
    }
  }

  // componentDidMount(){
  //   fetch('http://localhost:3001/api')
  //     .then(res => res.json())
  //     .then(data => this.setState({username: data.username}))
  // }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={Login} />
              <Route path="/test" component={Test} />
            </Switch>
          </BrowserRouter>
        </header>
      </div>
    );
  }
}

export default App;