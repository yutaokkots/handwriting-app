import React, { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import Drawing from '../components/Drawing'
import ThemeToggler from '../components/ThemeToggler'


const App:React.FC = () => {

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
    <ThemeToggler />
    <Drawing/>

    </>
  )
}

export default App
