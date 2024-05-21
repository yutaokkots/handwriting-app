import React, { useState, useEffect } from 'react'
// import './App.css'
import Drawing from '../components/Drawing'
import NavBar from '../components/NavBar/NavBar'
//import { indexedDBLoader } from '../utilities/indexedDB-loader'
import init from '../sqlite-utilities/sqlite.worker.js'

const App:React.FC = () => {
    const [ windowSize, setWindowSize ] = useState<{width: number; height: number;}>({
        width: window.innerWidth,
        height : window.innerHeight
    })
    const [ database, setDatabase ] = useState(null);

    useEffect(() => {
        //const storedItem = indexedDBLoader("characterResource")
        //console.log(storedItem)
        
        const db = init()
        setDatabase(db)
        console.log(db)
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
    console.log(database)
    
    return (  
            <>
                <NavBar />
                    <div>{windowSize.width} x {windowSize.height}</div>
                    
                <Drawing/>
            </>
            )
}

export default App
