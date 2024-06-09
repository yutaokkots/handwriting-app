import React, { useEffect, useState } from 'react'
import { useSearchState , SearchState } from "../../lib/store";


const OutputDisplay:React.FC = () => {
    //Stores search query. 
    const { searchState, searchStateSetter }:SearchState = useSearchState() 
    const [ inputValue, setInputValue ] = useState<string>('')

    useEffect(() => {
        setInputValue(searchState)
        console.log(`useEffect: ${searchState}`)

    }, [searchState])

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
        searchStateSetter(inputValue)
    }
    return (
        <input 
            onInput={handleChange}
            type="text"
            className="w-[380px] dark:bg-[--accent-color-dark] p-2"
            value={inputValue}>
        </input>
    )
}

export default OutputDisplay