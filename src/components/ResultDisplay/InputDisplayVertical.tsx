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
    }

    return (
        <>
            <div 
                onClick={() => handleEvent(displayChar)} 
                className={`hover:text-red-300 flex align-center mb-3 text-md ${selectedChar == displayChar ? "text-red-300" : "text-black"}`}>
                {displayChar}
            </div>
        </>
    )
}

const InputDisplayVertical: React.FC<SuggestionProps> = ({ suggestions, name, characterSelection, selectedChar, addCharacterSelection}) => {
  return (
    <div>
        <div className="grid grid-rows-12 p-1 hover:cursor-pointer ">
            <div className="row-span-2">{name}:</div>
            <div className="flex row-span-11 overflow-y-scroll h-[210px] scrollbar"
                style={{
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                }}>
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
    </div>
  )
}

export default InputDisplayVertical