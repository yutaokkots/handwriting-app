import React, { useState, useEffect, useRef } from "react";
import Handwriting from '../lib/handwriting-class.ts';
import { inputOptions } from '../lib/handwriting-options.ts';
import SearchList from '../data/searchlist.json'
import KanaList from '../data/kanalist.json'
import { useThemeStore, ThemeState } from "../lib/store.ts";
import { themeGetter } from '../utilities/themeSetterGetter.ts';
import { useTranslation } from "react-i18next";
import Recognition from "./Buttons/Recognition.tsx";
import ClearButton from "./Buttons/ClearButton.tsx";
import UndoButton from "./Buttons/UndoButton.tsx";

//type CanvasType = (typeof Handwriting)['Canvas']

// Create an instance of the Handwriting.Canvas class,
//    and use that instance to call the erase method.
type CanvasType = InstanceType<typeof Handwriting.Canvas>;

const Drawing:React.FC = () => {
    // useTranslation hook from 'react-i18next'
    const { t } = useTranslation("translation")

    // canvas instance state
    const [canvas, setCanvas] = useState<CanvasType | null>();
    // inputSuggestions for found characters
    const [inputSuggestions, setInputSuggestions] = useState<string[]>([]);
    const [inputKanaSuggestions, setInputKanaSuggestions] = useState<string[]>([]);
    const [entry, setEntry] = useState<string[]>([]);

    const { themeState, themeStateSetter }:ThemeState = useThemeStore() 

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const eraseBoard = () => {
        canvas && canvas.erase()
        setInputSuggestions([]);        
        setInputKanaSuggestions([]);        
    };
    
    const undoButton = () => {
        canvas && canvas.undo()
        setInputSuggestions([]);        
        setInputKanaSuggestions([]);        
    }
    
    const handleDraw = () => {
        // 
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
            setInputSuggestions(filteredKanji);
            setInputKanaSuggestions(filteredKana);
        }
      };

    const recognizeChar = () => {
        canvas && canvas.recognize(canvas.trace, inputOptions, inputCallback)
    }

    return (
        <>
            <div className="dark:border-[--accent-color-light] border-2 rounded-lg m-2 w-[400px]">
                <div className="grid grid-cols-4 gap-2">
                    <div className="m-2 col-span-3">
                        <canvas 
                                    className="absolute bg-[--tertiary-color] dark:bg-[--accent-color-dark] rounded-lg cursor-crosshair stroke-black" 
                                    id="canvas" 
                                    onMouseDown={handleDraw}
                                    ref={canvasRef} 
                                    width={300} 
                                    height={300}/>
                        <div className="relative border-l-2 left-[150px] h-[300px] w-[150px] border-dashed border-gray-400 pointer-events-none ">
                            <div className="relative top-[150px] border-b-2 left-[-150px] w-[300px] bt-1  border-gray-400 border-dashed pointer-events-none">
                            </div>          
                        </div>
                    </div>
                    <div className="col-span-1">
                        <button 
                            className="button-light m-2 w-[80px] h-[300px]"
                            aria-label={t("recognize-button")}
                            onClick={recognizeChar}>
                            <Recognition />
                        </button>
                    </div>
                </div>
                <div>
                    <button 
                        className="button-light m-2"
                        aria-label={t("clear-button")}
                        onClick={eraseBoard}>
                        <ClearButton />
                    </button>
                    <button 
                        className="button-light m-2"
                        onClick={undoButton}>
                        <UndoButton />
                    </button>

                    <div>{inputSuggestions}</div>
                    <div>{inputKanaSuggestions}</div>
                </div>
            </div>
        </>
    )
}

export default Drawing

// const Canvas = styled.canvas`
  // position: relative;
  // width: 220px;
  // height: 220px;
  // border: 1px solid var(--color-light);
  // border-radius: 4px;
  // cursor: crosshair;
// `;
