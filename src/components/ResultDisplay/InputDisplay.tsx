import React from 'react'


interface SuggestionProps{
    suggestions:string[];
    name: string;
    characterSelection: (character:string) => void
    selectedChar: string;
    addCharacterSelection: (character:string) => void;
}

interface CharProps {
    displayChar: string;
    characterSelection: (character:string) => void
    selectedChar: string;
    addCharacterSelection: (character:string) => void;
}

const Character: React.FC<CharProps> = ({ displayChar, characterSelection, selectedChar, addCharacterSelection }) => {
    
    const handleEvent = (character:string) => {
        addCharacterSelection(character)
        //characterSelection(character)
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

const InputDisplay: React.FC<SuggestionProps> = ({ suggestions, name, characterSelection, selectedChar, addCharacterSelection}) => {
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
                        addCharacterSelection={addCharacterSelection}
                    />)
                }
            </div>
        </div>
    )
}

export default InputDisplay