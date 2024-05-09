import React, { useState, useEffect, useRef } from "react";
import Handwriting from '../lib/handwriting-class.ts';
import { inputOptions } from '../lib/handwriting-options.ts';
import SearchList from '../data/searchlist.json'
import KanaList from '../data/kanalist.json'
import { useThemeStore, ThemeState } from "../lib/store.ts";
import { useSearchState , SearchState } from "../lib/store.ts";
import { themeGetter } from '../utilities/themeSetterGetter.ts';
import { useTranslation } from "react-i18next";
import Recognition from "./Buttons/Recognition.tsx";
import ClearButton from "./Buttons/ClearButton.tsx";
import UndoButton from "./Buttons/UndoButton.tsx";
import AddButton from "./Buttons/AddButton.tsx";
import InputDisplay from "./ResultDisplay/InputDisplay.tsx";
import SearchBar from "./ResultDisplay/SearchBar.tsx";

// const dummyData = ["私","法","上","意","思","表","示","法","律","行","為"]
// const dummyData2 = ["の","お"]

//type CanvasType = (typeof Handwriting)['Canvas']

// Create an instance of the Handwriting.Canvas class,
//    and use that instance to call the erase method.
type CanvasType = InstanceType<typeof Handwriting.Canvas>;

const Drawing:React.FC = () => {
    // useTranslation hook from 'react-i18next'
    const { t } = useTranslation("translation")

    // Handwriting.Canvas canvas instance state is declared.
    const [canvas, setCanvas] = useState<CanvasType | null>();

    // State that keeps track if canvas is empty (true) or contains mousedown (false)
    const [canvasEmpty, setCanvasEmpty] = useState<boolean>(true);

    // Stores 'inputSuggestions' for kana and kanji characters found after API request.
    const [inputKanjiSuggestions, setInputKanjiSuggestions] = useState<string[]>([]);
    const [inputKanaSuggestions, setInputKanaSuggestions] = useState<string[]>([]);

    // Once user clicks on a character, it is temporarily stored in 'selectedChar'.
    const [selectedChar, setSelectedChar] = useState<string>("");

    //Stores search query. 
    const { searchState, searchStateSetter }:SearchState = useSearchState() 

    // Stores 'dark' or 'light' for quick switch between dark/light mode. 
    const { themeState, themeStateSetter }:ThemeState = useThemeStore() 

    const canvasRef = useRef<HTMLCanvasElement>(null);    
    
    // Calls .erase() method on Canvas instance and resets input arrays
    const eraseBoard = () => {
        canvas && canvas.erase()
        setInputKanjiSuggestions([]);        
        setInputKanaSuggestions([]);       
        setCanvasEmpty(true) 
    };
    
    // Calls .undo() method on Canvas instance to backtrack on writing stroke.
    const undoButton = () => {
        canvas && canvas.undo()
        setInputKanjiSuggestions([]);        
        setInputKanaSuggestions([]);        
    }
    
    //
    const handleDraw = () => {
        setCanvasEmpty(false) 
    }

    useEffect(() => {
        eraseBoard();
        const theme = themeGetter()
        themeStateSetter(theme)
        const canvasElement = document.getElementById('canvas');
        if (canvasElement && canvasElement instanceof HTMLCanvasElement) {
            const canvasInstance = new Handwriting.Canvas(
                canvasElement, 
                themeState);
            setCanvas(canvasInstance);
        } else {
            console.error('Canvas element not found or not a canvas element');
        }
    }, [themeState]);

    // The function to search local db for matching characters.
    const inputCallback = (result: string[], err: string) => {
        if (err) {
            return;
            // console.log(err);
        } else {
            // selects from characters from 'searchlist.json'
            const kanjiList = SearchList.map((entry) => entry.k);
            const kanaList = KanaList.map((entry) => entry.kana);
            const filteredKanji = result
                .filter((entry) => kanjiList.includes(entry))
                .slice(0, 4);
            const filteredKana = result
                .filter((entry) => kanaList.includes(entry))
                .slice(0, 4);
            // after finding and filtering, displays found characters on screen.
            setInputKanjiSuggestions(filteredKanji);
            setInputKanaSuggestions(filteredKana);
        }
      };

    // Adds 'selectedChar' to '' state when selected.
    const addCharacterSelection = () => {
        // erase the board
        // reset the inputKanjiSuggestions state
        // reset the inputKanaSuggestions state
        // clear the 'selectedChar' state

        // add the current character that is inside the 'selectedChar' state to 
        // the 'searchState' global state. 
        
        searchStateSetter(searchState+selectedChar)
        eraseBoard()
        setSelectedChar("");
    }

    // Below function is prop-drilled to inputDisplay to enable 'selectedChar' state change in child. 
    const characterSelection = (character:string) => {
        setSelectedChar("");
        setSelectedChar(character)
    }

    // Calls .recognize() on Canvas instance to send API request for char. recog.
    const recognizeChar = () => {
        canvas && canvas.recognize(canvas.trace, inputOptions, inputCallback)
    }

    return (
        <>
            <div className="dark:border-[--accent-color-light] border-2 rounded-lg m-2 w-[400px]">
                <div className="m-2 text-6xl">
                    <SearchBar />
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {/* <button 
                        className="button-light m-2"
                        aria-label={t("clear-button")}
                        onClick={eraseBoard}>
                        <ClearButton />
                    </button> */}
                    {/* <button 
                        className="button-light m-2"
                        onClick={undoButton}>
                        <UndoButton />
                    </button> */}
                </div>
                <div className="grid grid-cols-4 gap-2">
                    <div className="m-2 col-span-3 relative w-[250px]">
                        <canvas 
                            className="absolute bg-[--tertiary-color] dark:bg-[--accent-color-dark] rounded-lg cursor-crosshair stroke-black" 
                            id="canvas" 
                            onMouseDown={handleDraw}
                            onMouseUp={recognizeChar}
                            onTouchStart={handleDraw}
                            onTouchEnd={recognizeChar}
                            ref={canvasRef} 
                            width={250} 
                            height={250}/>
                        <button 
                            className="absolute border-2 rounded-md m-2"
                            aria-label={t("clear-button")}
                            onClick={eraseBoard}>
                            <ClearButton />
                        </button>
                        <button 
                            className="absolute border-2 rounded-md m-2 right-0"
                            onClick={undoButton}>
                            <UndoButton />
                        </button> 
                        <div className="relative border-l-2 h-[250px] left-[125px]  w-[125px] border-dashed border-gray-400 pointer-events-none ">
                            <div className="relative w-[250px] top-[125px] left-[-125px]  bt-1  border-b-2 border-gray-400 border-dashed pointer-events-none">
                            </div>          
                        </div>
                    </div>
                    <div className="m-2 col-span-1 relative">
                        <button 
                            id="recognize"
                            disabled={canvasEmpty}
                            className="button-light w-[80px] h-[185px] disabled:bg-gray-400"
                            aria-label={t("recognize-button")}
                            onClick={recognizeChar}>
                                <Recognition />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-2 ">
                    <div className="m-2 col-span-3" >
                            <div className="grid grid-rows-2 w-[300px] p-1 gap-1">
                                <div>
                                    <InputDisplay 
                                        suggestions={inputKanjiSuggestions} 
                                        characterSelection={characterSelection} 
                                        selectedChar={selectedChar} 
                                        name={t("kanji")}/>
                                </div>
                                <div>
                                    <InputDisplay 
                                        suggestions={inputKanaSuggestions} 
                                        characterSelection={characterSelection} 
                                        selectedChar={selectedChar} 
                                        name={t("kana")}/>
                                </div>
                            </div>
                    </div>
                    <button
                        onClick={addCharacterSelection}
                        disabled={selectedChar == ""}
                        className="button-light m-2 w-[80px] h-[90px] col-span-1 flex justify-center disabled:bg-slate-500">
                            <AddButton />
                    </button>

                </div>

                <div className="flex-row">
                    <div>inputKanjiSuggestions is {inputKanjiSuggestions.length == 0 ? "empty" : "full"}</div>
                    <div>inputKanaSuggestions is {inputKanaSuggestions.length == 0 ? "empty" : "full"}</div>
                    <div>'selectedChar' is {selectedChar ? "full" : "empty"}: {selectedChar}</div>
                    <div>'searchState' is {searchState ? "full" : "empty"}: {searchState}</div>
    
                </div>

            </div>
        </>
    )
}

export default Drawing

