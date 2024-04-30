import React, { useState, useEffect } from "react";
import handwriting from '../../utilities/handwriting';
import { inputOptions } from '../../lib/handwriting-settings'
import SearchList from '../../data/searchlist.json'

const Drawing = () => {
    // // canvas instance state
    // const [canvas, setCanvas] = useState();
    // // inputSuggestions for found characters
    // const [inputSuggestions, setInputSuggestions] = useState();

    // const eraseBoard = () => {
    //     canvas && canvas.erase()
    //     setInputSuggestions([]);        
    // };

    // useEffect(() => {
    //     eraseBoard();
    //     // declare new Canvas object
    //     const newCanvas = new handwriting.Canvas(
    //         document.getElementById("handInput"),
    //         "dark"
    //     )
    //     setCanvas(newCanvas);
    // }, []);

    // const inputCallback = (result: string[], err: string) => {
    //     if (err) {
    //       return;
    //       // console.log(err);
    //     } else {
    //       const kanjiList = SearchList.map((entry) => entry.k);
    //       const filtered = result
    //         .filter((entry) => kanjiList.includes(entry))
    //         .slice(0, 4);
    //       setInputSuggestions(filtered);
    //     }
    //   };
    

    // const recognizeChar = () => {
    //     canvas && canvas.recognize(canvas.trace, inputOptions, inputCallback)
    // }

    return (
        <div>Drawing</div>
    )
}

export default Drawing