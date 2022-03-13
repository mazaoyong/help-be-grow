import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom"

import Home from '@pages/home'
import FindPage from '@pages/findPage'
import Usage from './pages/usage'

const Menu = () => (
  <div>
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/usage">Usage</Link>
        </li>
        <li>
          <Link to="/findPage">FindPage</Link>
        </li>
        <li>
          <Link to="/menu">Menu</Link>
        </li>
      </ul>
    </nav>
  </div>
)

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/usage" element={<Usage/>}>
        </Route>
        <Route path="/findPage" element={<FindPage/>}>
        </Route>
        <Route path="/menu" element={<Menu/>}>
        </Route>
        <Route path="/" element={<Home/>}>
        </Route>
      </Routes>
    </Router>
  )
}

export default App

