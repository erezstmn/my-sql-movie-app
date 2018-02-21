import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import path from 'path';


class App extends Component {
  constructor(){
    super();
    this.handleButton = this.handleButton.bind(this);
    
  }
  handleButton(){
    axios.get('../movies').then((res) => {
      console.log(res);
    }).catch((e) => {
      console.log(e);
    })
  };  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
         HELLLLLLOOOOO!!!!
        </p>
        <button onClick={this.handleButton}>Get something from server</button>
      </div>
    );
  }
}

export default App;
