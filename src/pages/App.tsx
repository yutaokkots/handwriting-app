import React from 'react'
// import './App.css'
import Drawing from '../components/Drawing'
import ThemeToggler from '../components/ThemeToggler'


const App:React.FC = () => {

    return (
        <>
            <ThemeToggler />
            <Drawing/>
        </>
    )
}

export default App
