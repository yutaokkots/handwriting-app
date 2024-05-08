import React from 'react'



interface SuggestionProps{
    suggestions:string[];
    name: string;
    characterSelection: (character:string) => void
    selectedChar: string;
}

interface CharProps {
    displayChar: string;
    characterSelection: (character:string) => void
    selectedChar: string;
}

const Character: React.FC<CharProps> = ({ displayChar, characterSelection, selectedChar }) => {
    
    const handleEvent = (character:string) => {
        characterSelection(character)
    }

    return (
        <>
            <div 
                onClick={() => handleEvent(displayChar)} 
                onTouchStart={() => handleEvent(displayChar)} 
                className={`hover:text-red-300  mr-2 text-xl ${selectedChar == displayChar ? "text-red-300" : "text-black"}`}>
                {displayChar}
            </div>
        </>
    )
}

const InputDisplay: React.FC<SuggestionProps> = ({ suggestions, name, characterSelection, selectedChar}) => {
    return (
        <div className="grid grid-cols-4 border-2 rounded-md p-2 h-[40px] hover:cursor-pointer ">
            <div className="col-span-1">{name}:</div>
            <div className="flex col-span-3 overflow-x-auto h-[40px] scrollbar">
                {suggestions.map((s, idx) => 
                    <Character 
                        key={idx} 
                        displayChar={s} 
                        characterSelection={characterSelection}
                        selectedChar={selectedChar}
                    />)
                }
            </div>
        </div>
    )
}

export default InputDisplay