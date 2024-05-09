import React, { useState, useEffect, useRef } from 'react'
import { useSearchState , SearchState } from "../../lib/store";

const SearchBar:React.FC  = () => {
    //Stores search query. 
    const { searchState, searchStateSetter }:SearchState = useSearchState() 
    const [ inputValue, setInputValue ] = useState<string>('')

    useEffect(() => {
        setInputValue(searchState)
    }, [inputValue, searchState])

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
        searchStateSetter(e.target.value)
    }

    return (
        <input 
            onChange={handleChange}
            type="text"
            className="w-[380px] dark:bg-[--accent-color-dark] p-2 rounded-md"
            value={inputValue}>
            
        </input>
    )
}

export default SearchBar


