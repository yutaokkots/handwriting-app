import React, { useState, useEffect } from 'react'
import Drawing from '../components/Drawing'
import NavBar from '../components/NavBar/NavBar'
import { useWorkerStore } from '../lib/store';

/// WORKERS
//import { indexedDBLoader } from '../utilities/indexedDB-loader'
//import init from '../sqlite-utilities/sqlite.worker.js'
import { initBackend } from 'absurd-sql/dist/indexeddb-main-thread';

const App:React.FC = () => {
    // State that store window-size information. 
    const [ windowSize, setWindowSize ] = useState<{width: number; height: number;}>({
        width: window.innerWidth,
        height : window.innerHeight
    })

    // Global store that holds the worker thread in the 'workerState'
    const { workerState, setWorkerState } = useWorkerStore() 

    useEffect(() => {
        const worker = new Worker(new URL('../index.worker.js', import.meta.url), { type: 'module' });
        // This is only required because Safari doesn't support nested
        //      workers. This installs a handler that will proxy creating web
        //      workers through the main thread

        // Sets a global 'workerState' that stores the worker thread object. 
        setWorkerState(worker)

        initBackend(worker);

        // Displays window size
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height : window.innerHeight
            })
        }
        window.addEventListener('resize', handleResize);

        // Unmounting this component removes the eventListener and terminates worker thread.
        return () => {
            window.removeEventListener('resize', handleResize)
            if (workerState){
                worker.terminate()
            }
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
