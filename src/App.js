import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Login, Entrance, Workspace } from './component';
import './static/css/app.css'

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      test:"test"
    }
  }

  render(){
    return (
      <div className="App">
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={Login} />
              <Route exact path="/workspace" component={Entrance} />
              <Route 
                path="/workspace/:workspace" 
                component={Workspace} 
              />
            </Switch>
          </BrowserRouter>
      </div>
    );
  }
}

export default App;