import { useState } from 'react'
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import './index.css'
import Cost_Estimation from "./components/Cost_Estimation";
import Destination from "./components/search";

function App() {
  
  return (
    <>
<h1>Trip budget calculator</h1>
<Cost_Estimation />
<Destination />
    </>
  )
}

export default App
