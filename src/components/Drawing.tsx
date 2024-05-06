import React, { useState, useEffect, useRef } from "react";
import Handwriting from '../lib/handwriting-class.ts';
// import styled from "@emotion/styled";
import { inputOptions } from '../lib/handwriting-options.ts';
import SearchList from '../data/searchlist.json'
import { useThemeStore, ThemeState } from "../lib/store.ts";
import { themeGetter } from '../utilities/themeSetterGetter.ts';
import Recognition from "./Buttons/Recognition.tsx";

//type CanvasType = (typeof Handwriting)['Canvas']

// Create an instance of the Handwriting.Canvas class,
//    and use that instance to call the erase method.
type CanvasType = InstanceType<typeof Handwriting.Canvas>;

const Drawing:React.FC = () => {
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
        //canvas && canvas.recognize(canvas.trace, inputOptions, inputCallback)
        console.log("recognize char button")
    }

    return (
        <>
            <div >Drawing</div>
            <div className="border-2 border-black rounded-md m-2 ">
                <canvas 
                    className="dark:bg-gray-500 cursor-crosshair stroke-black" 
                    id="canvas" 
                    ref={canvasRef} 
                    width={300} 
                    height={300}/>
                <button 
                    className="bg-lightindigo dark:bg-lightbeige"
                    onClick={recognizeChar}>
                    <Recognition />
                </button>
            </div>
            <div className="dark:text-lightbeige bg-darkindigo dark:bg-darkbeige">HELLO</div>
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
