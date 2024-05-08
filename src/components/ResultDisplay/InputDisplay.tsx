import React from 'react'

interface SuggestionProps{
    suggestions:string[];
    name: string;
}

interface CharProps {
    displayChar: string;
}

const Char: React.FC<CharProps> = ({ displayChar }) => {
    return (
        <>
            <div className="hover:text-red-300 mr-2 text-lg">
                {displayChar}
            </div>
        </>
    )
}

const InputDisplay: React.FC<SuggestionProps> = ({suggestions, name}) => {
    return (
        <div className="grid grid-cols-4 border-2 rounded-md p-2 h-[40px] hover:cursor-pointer ">
            <div className="col-span-1">{name}:</div>
            <div className="flex col-span-3 overflow-x-auto h-[40px] scrollbar">
                {suggestions.map((s, idx) => <Char key={idx} displayChar={s}/>)}
            </div>
        </div>
    )
}

export default InputDisplay