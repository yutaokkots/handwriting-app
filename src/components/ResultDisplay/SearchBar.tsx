import React, { useState, useEffect, useRef } from 'react'
import { useSearchState , SearchState } from "../../lib/store";

const SearchBar:React.FC  = () => {
    //Stores search query. 
    const { searchState, searchStateSetter }:SearchState = useSearchState() 
    const [ inputValue, setInputValue ] = useState<string>('')

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setInputValue(searchState)

        if (inputRef.current){
            console.log(inputRef.current.value.length)
            console.log(inputRef)
            inputRef.current.focus() 
            const newPosition = inputRef.current.value.length;
            inputRef.current.setSelectionRange(newPosition, newPosition);
        }
        
    }, [inputValue, searchState])

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
        searchStateSetter(e.target.value)
    }


    return (
        <input 
            onChange={handleChange}
            type="text"
            ref={inputRef}
            className="w-[380px] dark:bg-[--accent-color-dark] p-2 rounded-md"
            value={inputValue}>
            
        </input>
    )
}

export default SearchBar


