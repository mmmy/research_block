import React, { Component } from 'react';
import Home from './views/Home'
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom"

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          只是一个网站示例
        </header>
        <Home />
      </div>
    );
  }
}

export default App;
