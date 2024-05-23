import React, { useState, useEffect } from 'react'
// import './App.css'
import Drawing from '../components/Drawing'
import NavBar from '../components/NavBar/NavBar'

/// WORKERS
//import { indexedDBLoader } from '../utilities/indexedDB-loader'
//import init from '../sqlite-utilities/sqlite.worker.js'
import { initBackend } from 'absurd-sql/dist/indexeddb-main-thread';



const App:React.FC = () => {
    const [ windowSize, setWindowSize ] = useState<{width: number; height: number;}>({
        width: window.innerWidth,
        height : window.innerHeight
    })
    //const [ database, setDatabase ] = useState(null);

    useEffect(() => {
        //const storedItem = indexedDBLoader("characterResource")
        //console.log(storedItem)

        //////////
        const worker = new Worker(new URL('../index.worker.js', import.meta.url));
        // This is only required because Safari doesn't support nested
        // workers. This installs a handler that will proxy creating web
        // workers through the main thread

        initBackend(worker);
        //////////


        // const db = init()
        // setDatabase(db)
        // console.log(db)
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
