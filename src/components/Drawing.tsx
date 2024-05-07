import React, { useState, useEffect, useRef } from "react";
import Handwriting from '../lib/handwriting-class.ts';
import { inputOptions } from '../lib/handwriting-options.ts';
import SearchList from '../data/searchlist.json'
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
    const { themeState, themeStateSetter }:ThemeState = useThemeStore() 

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const eraseBoard = () => {
        canvas && canvas.erase()
        setInputSuggestions([]);        
    };
    
    const undoButton = () => {
        canvas && canvas.undo()
        setInputSuggestions([]);        
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
            const kanjiList = SearchList.map((entry) => entry.k);
            const filtered = result
                .filter((entry) => kanjiList.includes(entry))
                .slice(0, 4);
            setInputSuggestions(filtered);
        }
      };

    const recognizeChar = () => {
        canvas && canvas.recognize(canvas.trace, inputOptions, inputCallback)
    }

    return (
        <>
            <div className="dark:border-[--accent-color-light] border-2 rounded-lg m-2">
                <canvas 
                    className="bg-[--tertiary-color] dark:bg-[--accent-color-dark] rounded-lg cursor-crosshair stroke-black m-2" 
                    id="canvas" 
                    onMouseDown={handleDraw}
                    ref={canvasRef} 
                    width={300} 
                    height={300}/>
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
                    <button 
                        className="button-light m-2"
                        aria-label={t("recognize-button")}
                        onClick={recognizeChar}>
                        <Recognition />
                    </button>
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
