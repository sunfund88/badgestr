import React, { useState, useMemo } from "react";
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Routes, Route, Link } from "react-router-dom";
import Badge from "./components/Badge/Badge";
import Home from "./components/Home/Home";
import Profile from "./components/Profile/Profile";
import { SimplePool, getEventHash, getSignature, nip19 } from 'nostr-tools';


const pool = new SimplePool()
window.pool = pool
window.relays = [
  'wss://nostr-pub.wellorder.net',
  'wss://nos.lol',
  'wss://nostr.mom',
  'wss://offchain.pub'
].map(r => [r, { read: true, write: true }])

function App() {
  return (
    // <Badge />
    // <Profile />
    <div className="container">
      <nav>
        <div className="logo">
          <a href="/"><h1>Badge<span className="purple">Str</span></h1></a>
        </div>
        {/* <div className="nav-btn">
          <a href="#" className="login">Log in</a>
        </div> */}
      </nav>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/p/:id' element={<Profile />} />
          <Route path='/b/:id' element={<Profile />} />
        </Routes>
      </Router>
      <footer>
        Made with 💜 by ... <a href="https://next.nostrudel.ninja/#/u/npub12r5wuvggeh77ft00aycf8nfchkrf9avly5xnaepffm6xmsgz7dcqrvm6se" target="_blank">Suntoshi⚡️</a>
      </footer>
    </div>
  );
}

export default App;
