import React from 'react'
import ThemeToggler from '../Toggler/ThemeToggler'
 
const NavBar: React.FC = () => {
  return (
    <nav>
        <ul className="v-screen flex justify-between">
            <li>Jukugo Analyzer - 熟語</li>
            <li>About</li>
            <li><ThemeToggler /></li>
        </ul>
    </nav>
  )
}

export default NavBar