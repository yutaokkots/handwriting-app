import React, { useState, useEffect, useRef } from "react";
import Handwriting from '../lib/handwriting-class.ts';
import { inputOptions } from '../lib/handwriting-options.ts';
import SearchList from '../data/searchlist.json'
import KanaList from '../data/kanalist.json'
import { useThemeStore, ThemeState } from "../lib/store.ts";
import { useSearchState , SearchState } from "../lib/store.ts";
import { themeGetter } from '../utilities/themeSetterGetter.ts';
import { useTranslation } from "react-i18next";
import ClearButton from "./Buttons/ClearButton.tsx";
import UndoButton from "./Buttons/UndoButton.tsx";
import SearchInput from "./ResultDisplay/SearchInput.tsx";
import InputDisplayVertical from "./ResultDisplay/InputDisplayVertical.tsx";
import labels from '../lib/labels.ts'
import InputDisplayController from "./ResultDisplay/InputDisplayController.tsx";
import SearchResult from "./ResultDisplay/SearchResult.tsx";

// test
//const inputKanjiSuggestion = ["な","ご","や","か","に","喜","び","合","い","楽","し","む","さ","ま"]

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

    const [inputAllSuggestions, setInputAllSuggestions] = useState<string[]>([]);

    inputAllSuggestions;

    // Once user clicks on a character, it is temporarily stored in 'selectedChar'.
    const [selectedChar, setSelectedChar] = useState<string>("");

    //Stores search query. 
    const { searchState, searchStateSetter }:SearchState = useSearchState() 

    // Stores 'dark' or 'light' for quick switch between dark/light mode. 
    const { themeState, themeStateSetter }:ThemeState = useThemeStore() 

    const canvasRef = useRef<HTMLCanvasElement>(null);  
    
    const inputRef = useRef<HTMLInputElement | null>(null);
    
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
        // Initializes theme.
        const theme = themeGetter()
        themeStateSetter(theme)
        // Initializes canvas element.
        const canvasElement = document.getElementById('canvas');
        if (canvasElement && canvasElement instanceof HTMLCanvasElement) {
            const canvasInstance = new Handwriting.Canvas(
                canvasElement, 
                themeState);
            setCanvas(canvasInstance);
        } else {
            console.error('Canvas element not found or not a canvas element');
        }
        // Initializes search bar
        inputRef.current = document.getElementById("search-input") as HTMLInputElement;

    }, [themeState]);

    // The function to search local db for matching characters.
    const inputCallback = (result: string[], err: string | Error) => {
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
            setInputAllSuggestions(filteredKana.concat(filteredKanji))
        }
      };

    // Adds 'selectedChar' to '' state when selected.
    const addCharacterSelection = (pickedChar: string) => {
        searchStateSetter(searchState+pickedChar)
        eraseBoard()
        setSelectedChar("");
    }

    // Below function is prop-drilled to inputDisplay to enable 'selectedChar' state change in child. 
    // const characterSelection = (character:string) => {
    //     setSelectedChar("");
    //     setSelectedChar(character)
    // }

    // Calls .recognize() on Canvas instance to send API request for char. recog.
    const recognizeChar = () => {
        canvas && canvas.recognize(canvas.trace, inputOptions, inputCallback)
    }

    // deletes a character in input field
    const deleteChar = () => {
        if (searchState){
            const str = searchState.slice(0, -1)
            searchStateSetter(str)
        }
    }

    // deletes the input field
    const deleteInputField = () => {
        searchStateSetter("")
    }

    return (
        <>
            <div className="dark:border-[--accent-color-light] border-2 rounded-lg m-2 w-[400px]">
                <div className="grid-cols-4 ">
                    <div className="relative flex-col m-2 col-span-4 h-[130px] w-[380px] dark:bg-[--accent-color-dark] rounded-md">
                        <SearchInput inputRef={inputRef}/>
                        <div className="absolute bottom-1 text h-[25px] m-2 ml-3">
                            <SearchResult />
                        </div>

                    </div>
                </div>


                <div className="grid grid-cols-12 gap-2">
                    <div className="m-1 ml-2 col-span-3 bg-white bg-opacity-20 rounded-lg w-[90px] h-[260px]">
                        <div className="grid grid-cols-2">
                            <InputDisplayVertical 
                                suggestions={inputKanjiSuggestions}                                      
                                selectedChar={selectedChar} 
                                addCharacterSelection={addCharacterSelection}
                                name={labels.kanji}/> 
                            <InputDisplayVertical 
                                suggestions={inputKanaSuggestions}                                      
                                selectedChar={selectedChar} 
                                addCharacterSelection={addCharacterSelection}
                                name={labels.kana}/> 
                        </div>
                    </div>
                    <div className="relative m-1 col-span-8 w-[260px]">
                        <canvas 
                            className="absolute bg-[--tertiary-color] dark:bg-[--accent-color-dark] rounded-lg cursor-crosshair stroke-black" 
                            id="canvas" 
                            onMouseDown={handleDraw}
                            onMouseUp={recognizeChar}
                            onTouchStart={handleDraw}
                            onTouchEnd={recognizeChar}
                            ref={canvasRef} 
                            width={260} 
                            height={260}/>
                        <button 
                            className="absolute border-2 rounded-md m-2 disabled:opacity-30"
                            aria-label={t("clear-button")}
                            disabled={canvasEmpty}
                            onClick={eraseBoard}>
                            <ClearButton />
                        </button>
                        <button 
                            className="absolute border-2 rounded-md m-2 right-0 disabled:opacity-30"
                            disabled={canvasEmpty}
                            onClick={undoButton}>
                            <UndoButton />
                        </button> 
                        <div className="relative border-l-2 h-[260px] left-[130px] w-[130px] border-dashed border-gray-400 pointer-events-none ">
                            <div className="relative w-[260px] top-[130px] left-[-130px]  bt-1  border-b-2 border-gray-400 border-dashed pointer-events-none">
                            </div>          
                        </div>
                    </div>


                </div>
                <div 
                    className="grid grid-cols-12 m-2 gap-1"
                    >
                    <InputDisplayController 
                        deleteChar={deleteChar} 
                        inputRef={inputRef}
                        deleteInputField={deleteInputField}/>
                </div>
            
            </div>

            <div className="dark:border-[--accent-color-light] border-2 rounded-lg m-2 w-[400px]">

            </div>
        </>
    )
}

export default Drawing

