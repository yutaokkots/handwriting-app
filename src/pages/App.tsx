import React from 'react'
// import './App.css'
import Drawing from '../components/Drawing'
import ThemeToggler from '../components/Toggler/ThemeToggler'
import NavBar from '../components/NavBar/NavBar'

const App:React.FC = () => {
    return (
        <>
            <NavBar />
            <Drawing/>
        </>
    )
}

export default App
