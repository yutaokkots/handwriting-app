import React, { useState, useEffect, useRef, RefObject} from "react";
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
import InputDisplay from "./ResultDisplay/InputDisplay.tsx";
import DeleteButton from "./Buttons/DeleteButton.tsx";
import FieldBackButton from "./Buttons/FieldBackButton.tsx";
import FieldForwardButton from "./Buttons/FieldForwardButton.tsx";
import SearchInput from "./ResultDisplay/SearchInput.tsx";
import InputDisplayVertical from "./ResultDisplay/InputDisplayVertical.tsx";
import labels from '../lib/labels.ts'

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
    const characterSelection = (character:string) => {
        setSelectedChar("");
        setSelectedChar(character)
    }

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

    return (
        <>
            <div className="dark:border-[--accent-color-light] border-2 rounded-lg m-2 w-[400px]">
                <div className="grid-cols-4 ">
                    <div className="relative m-2 col-span-4 h-[80px]">
                        <SearchInput inputRef={inputRef}/>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-2">
                    <div className="m-1 ml-2 col-span-2 bg-white bg-opacity-20 rounded-lg w-[58px] h-[260px]">
                        <div className="grid grid-cols-2">
                            <InputDisplayVertical 
                                suggestions={inputKanjiSuggestions}                                      
                                characterSelection={characterSelection} 
                                selectedChar={selectedChar} 
                                addCharacterSelection={addCharacterSelection}
                                name={labels.kanji}/> 
                            <InputDisplayVertical 
                                suggestions={inputKanaSuggestions}                                      
                                characterSelection={characterSelection} 
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
                        <div className="relative border-l-2 h-[260px] left-[130px] w-[130px] border-dashed border-gray-400 pointer-events-none ">
                            <div className="relative w-[260px] top-[130px] left-[-130px]  bt-1  border-b-2 border-gray-400 border-dashed pointer-events-none">
                            </div>          
                        </div>
                    </div>
                    <div className="m-1  col-span-2  ">
                        <div className="row-span-1 relative h-[150px] ">
                            {/* <button
                                onClick={deleteChar}
                                disabled={searchState == ""}
                                className="absolute button-light w-[50px] h-[40px] mb-1 disabled:bg-gray-400 row-span-2"
                                aria-label={t("delete-button")}
                                >
                                    <DeleteButton />
                            </button> */}
    
                            {/* <div 
                                className="after:bg-white content-none after:absolute  after:w-[30px] after:h-[80px] after:rounded-br-full" >
                            </div> */}

                        </div>
                            <div className="flex flex-row gap-1">
                                <FieldBackButton />
                                <FieldForwardButton />
                            </div>
                        </div>

                </div>
                {/* <div className="grid grid-cols-4 gap-2 ">
                    <div className="m-2 col-span-4" >
                            <div className="grid grid-rows-2 w-[375px] p-1 gap-1">
                                <div>
                                    <InputDisplay 
                                        suggestions={inputKanjiSuggestions} 
                                        
                                        characterSelection={characterSelection} 
                                        selectedChar={selectedChar} 
                                        addCharacterSelection={addCharacterSelection}
                                        name={t("kanji")}/>
                                </div>
                                <div>
                                    <InputDisplay 
                                        suggestions={inputKanaSuggestions} 
                                        characterSelection={characterSelection} 
                                        selectedChar={selectedChar} 
                                        addCharacterSelection={addCharacterSelection}
                                        name={t("kana")}/>
                                </div>
                            </div>
                    </div>
                </div> */}

                <div className="flex-row">
                    <div>inputKanjiSuggestions is {inputKanjiSuggestions.length == 0 ? "empty" : "full"}</div>
                    <div>inputKanaSuggestions is {inputKanaSuggestions.length == 0 ? "empty" : "full"}</div>
                    <div>'selectedChar' is {selectedChar ? "full" : "empty"}: {selectedChar}</div>
                    <div>'searchState' is {searchState ? "full" : "empty"}: {searchState}</div>
                </div>

            </div>
            <div
                className="p-2 text-black "
                    style={{
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                    }}
            >煕煕</div>

        </>
    )
}

export default Drawing

