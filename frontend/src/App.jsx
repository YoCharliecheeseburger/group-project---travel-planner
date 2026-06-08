import { useState } from 'react'
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home'
import SavedTrips from './pages/SavedTrips'

import './index.css'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/SavedTrips' element={<SavedTrips />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
