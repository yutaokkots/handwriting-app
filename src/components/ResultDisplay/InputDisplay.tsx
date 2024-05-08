import React from 'react'



interface SuggestionProps{
    suggestions:string[];
    name: string;
    characterSelection: (character:string) => void
}

interface CharProps {
    displayChar: string;
    characterSelection: (character:string) => void
}

const Character: React.FC<CharProps> = ({ displayChar, characterSelection }) => {
    
    const handleEvent = (character:string) => {
        characterSelection(character)
    }

    return (
        <>
            <div 
                onClick={() => handleEvent(displayChar)} 
                onTouchStart={() => handleEvent(displayChar)} 
                className="hover:text-red-300  hover:text-2xl mr-2 text-xl">
                {displayChar}
            </div>
        </>
    )
}

const InputDisplay: React.FC<SuggestionProps> = ({suggestions, name, characterSelection}) => {
    return (
        <div className="grid grid-cols-4 border-2 rounded-md p-2 h-[40px] hover:cursor-pointer ">
            <div className="col-span-1">{name}:</div>
            <div className="flex col-span-3 overflow-x-auto h-[40px] scrollbar">
                {suggestions.map((s, idx) => 
                    <Character 
                        key={idx} 
                        displayChar={s} 
                        characterSelection={characterSelection}/>)
                }
            </div>
        </div>
    )
}

export default InputDisplay