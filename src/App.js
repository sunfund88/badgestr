import React, { useState } from "react";
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Routes, Route, Link } from "react-router-dom";
import Badge from "./components/Badge/Badge";
import Home from "./components/Home/Home";
import Profile from "./components/Profile/Profile";
import Navbar from "./components/Navbar/Navbar";
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
  async function printPub() {
    console.log(window.nostr)
    window.nostr._isEnabled = false
  }

  return (
    // <Badge />
    // <Profile />
    <div className="container">
      <Navbar />
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/p/:id' element={<Profile />} />
          <Route path='/b/:id' element={<Badge />} />
        </Routes>
      </Router>
      {/* 
      <button className="button" type="button" onClick={() => { printPub() }}>printPub()</button> */}

      <footer>
        Made with 💜 by ... <a href="https://next.nostrudel.ninja/#/u/npub12r5wuvggeh77ft00aycf8nfchkrf9avly5xnaepffm6xmsgz7dcqrvm6se" target="_blank">Suntoshi⚡️</a>
      </footer>
    </div>
  );
}

export default App;
