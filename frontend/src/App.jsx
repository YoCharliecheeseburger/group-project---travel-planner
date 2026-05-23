import { useState } from 'react'
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home'
import tripPage from './pages/tripPage'
import savedTrips from './pages/savedTrips'

import './index.css'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/tripPage' element={<tripPage />} />
        <Route path='/savedTrips' element={<savedTrips />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
