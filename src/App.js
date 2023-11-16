import React, { useState } from "react";
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Routes, Route, Link } from "react-router-dom";
import Badge from "./components/Badge/Badge";
import Home from "./components/Home/Home";
import Profile from "./components/Profile/Profile";
import Navbar from "./components/Navbar/Navbar";
import { SimplePool, getEventHash, getSignature, nip19 } from 'nostr-tools';
import { init_relays } from "./components/BadgeStrFunction";
import BadgeNew from "./components/Badge/BadgeNew";


const pool = new SimplePool()
window.pool = pool
window.relays = init_relays

function App() {
  return (
    <div className="container">
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/p/:id' element={<Profile />} />
          <Route path='/b/:id' element={<Badge />} />
          <Route path='/new' element={<BadgeNew />} />
        </Routes>
      </Router>

      <footer>
        Made with 💜 by ... <a href="https://next.nostrudel.ninja/#/u/npub12r5wuvggeh77ft00aycf8nfchkrf9avly5xnaepffm6xmsgz7dcqrvm6se" target="_blank">Suntoshi⚡️</a>
      </footer>
    </div>
  );
}

export default App;
