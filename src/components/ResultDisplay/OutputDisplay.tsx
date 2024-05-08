import React, { useEffect } from 'react'
import { useSearchState , SearchState } from "../../lib/store";


const OutputDisplay:React.FC = () => {
    //Stores search query. 
    const { searchState, searchStateSetter }:SearchState = useSearchState() 

    useEffect(() => {
        console.log(searchState)
    }, [searchState])

    const handleChange = () => {
        console.log("outputDisplay component triggered")
    }
    return (
        <input 
            onInput={handleChange}
            type="text"
            className="w-[380px] dark:bg-[--accent-color-dark] p-2"
            value={searchState}>
            
        </input>
    )
}

export default OutputDisplay