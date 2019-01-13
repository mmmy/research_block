import React, { Component } from 'react';
import Home from './views/Home'
import PlayGround from './views/PlayGround'
import SsqDemo from './views/SsqDemo'
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom"

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header className="clearfix">
            <div className="title">
              <h1>基于区块链hash值生成数列的系统与方法-DEMO示例</h1>
            </div>
            <nav>
              <Link to="/">首页</Link>
              <Link to="/ssq">双色球示例</Link>
              <Link to="/playground">PlayGround</Link>
              <a href='/paper'>论文</a>
            </nav>
          </header>
          <Route exact path='/' component={Home} />
          <Route path='/ssq' component={SsqDemo} />
          <Route path='/playground' component={PlayGround} />
        </div>
      </Router>
    );
  }
}

export default App;
