import { useState } from 'react'
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home'

import './index.css'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
