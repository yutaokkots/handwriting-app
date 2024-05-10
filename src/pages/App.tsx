import React, { useState, useEffect } from 'react'
// import './App.css'
import Drawing from '../components/Drawing'
import NavBar from '../components/NavBar/NavBar'



const App:React.FC = () => {
    const [ windowSize, setWindowSize ] = useState<{width: number; height: NavigatorConcurrentHardwareumber;}>({
        width: window.innerWidth,
        height : window.innerHeight
    })

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height : window.innerHeight
            })
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (  
            <>
                <NavBar />
                <div>{windowSize.width} x {windowSize.height}</div>
                <Drawing/>
            </>
            )
}

export default App
