import { inputOptions } from "./handwriting-options";

interface HandwritingOptions {
    width: number;
    height: number;
    language: string;
    numOfWords: number;
    numOfReturn: number;
}

type CanvasType = (typeof Handwriting)['Canvas']

type InputCallback = (result: string[], err: string) => void;

class Handwriting {
    _wrapped: unknown;
    obj: unknown;
    trace: Array<Array<Array<number>>> | undefined;

    constructor(obj: Handwriting | null){
        // Checks if the passed 'obj' is an instance of 'Handwriting'.
        //      If so, returns said obj.
        if (obj instanceof Handwriting) return obj;
        // Checks if the constructor is called without the 'new' keyword. 
        //      If so, then a new Handwriting (obj) is created and returned
        if (!(this instanceof Handwriting)) return new Handwriting(obj);
        // If none of the other conditions are met, then the obj is stored
        //      in the this._wrapped property of the current instance.
        // underscore ('_wrapped') denotes private variable
        // "wrapped" describes the process of encapsulating or wrapping a value
        //      or object within another object 
        this._wrapped = obj;
    }

    // Static method for recognizing the character
    static recognize(trace: Array<Array<Array<number>>>, options: HandwritingOptions, callback:InputCallback ){
        console.log("recognize()")
        const data = JSON.stringify({
            options: "enable_pre_space",
            requests: [
                {
                writing_guide: {
                    writing_area_width: options.width || this.width || undefined,
                    writing_area_height: options.height || this.width || undefined,
                },
                ink: trace,
                language: options.language || "ja",
                },
            ],
        });
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                switch (this.status) {
                    case 200: {
                        console.log("CASE 200")
                        const response = JSON.parse(this.responseText);
                        let results;
                        console.log(response)
                        if (response.length === 1) {
                            callback(undefined, new Error(response[0]));
                            break;
                        } else results = response[1][0][1];
                        if (options.numOfWords) {
                            results = results.filter(function (result) {
                                return result.length == options.numOfWords;
                            });
                        }
                        if (options.numOfReturn) {
                            results = results.slice(0, options.numOfReturn);
                        }
                        callback(results, undefined);
                        break;
                    }
                    case 403: {
                        console.log("CASE 403")
                        callback(undefined, new Error("access denied"));
                        break;
                    }
                    case 503: {
                        console.log("CASE 503")
                        callback(undefined, new Error("can't connect to recognition server"));
                        break;
                    }
        } } });
        xhr.open(
          "POST",
          "https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8"
        );
        xhr.setRequestHeader("content-type", "application/json");
        xhr.send(data);
      }    

    // Canvas property of Handwriting class
    static Canvas = class{
        public canvas: HTMLCanvasElement;
        cxt: CanvasRenderingContext2D | null;
        strokeStyle: string;
        // cxt.lineCap: "butt" | "round" | "square";
        // cxt.lineJoin: "round"|"bevel"|"miter";
        lineWidth: number;
        width: number;
        height: number;
        drawing: boolean;
        handwritingX: number[];
        handwritingY: number[];
        trace:Array<Array<Array<number>>>;
        options: HandwritingOptions;
        step: string[];
        redo_step: string[];
        redo_trace: number[][][];
        allowUndo: boolean;
        allowRedo: boolean;
        callback: InputCallback | undefined;
        recognize: (typeof Handwriting)['recognize']

        constructor(cvs: HTMLCanvasElement, theme:string){
            this.canvas = cvs;
            this.cxt = cvs.getContext("2d");
            this.strokeStyle = theme == "dark" ? "#e2e2e2" : "#1f1f1f"; 
                    // e2e2e2:light; 1f1f1f:dark 
            if (this.cxt) {
                this.cxt.lineCap = "round";
                this.cxt.lineJoin = "round";
            }
            this.lineWidth = 3;
            this.width = cvs.width;
            this.height = cvs.height;
            this.drawing = false;
            this.handwritingX = [];
            this.handwritingY = [];
            this.trace = [];
            this.options = inputOptions;
            this.step = [];
            this.redo_step = [];
            this.redo_trace = [];
            this.allowUndo = true;
            this.allowRedo = false;
            cvs.addEventListener("mousedown", this.mouseDown.bind(this));
            cvs.addEventListener("mousemove", this.mouseMove.bind(this));
            cvs.addEventListener("mouseup", this.mouseUp.bind(this));
            cvs.addEventListener("touchstart", this.touchStart.bind(this));
            cvs.addEventListener("touchmove", this.touchMove.bind(this));
            cvs.addEventListener("touchend", this.touchEnd.bind(this));
            this.callback = undefined;
            this.recognize = Handwriting.recognize;
        }

        set_Undo_Redo = (undo:boolean, redo:boolean) => {
            this.allowUndo = undo;
            this.allowRedo = undo ? redo : false;
            if (!this.allowUndo) {
                this.step = [];
                this.redo_step = [];
                this.redo_trace = [];
            }
        };

        setLineWidth = (lineWidth: number) => {
            this.lineWidth = lineWidth;
        };
            
        setCallBack = (callback: InputCallback) => {
            this.callback = callback;
        };
            
        setOptions = (options: typeof inputOptions ) => {
            this.options = options;
        };
            
        mouseDown = (e: MouseEvent) => {
            // new stroke
            if (this.cxt){
                this.cxt.strokeStyle = this.strokeStyle ?? '';
                this.cxt.lineWidth = this.lineWidth;
            }
            this.handwritingX = [];
            this.handwritingY = [];
            this.drawing = true;
            if (this.cxt){
                this.cxt.beginPath();
            }
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            if (this.cxt){
                this.cxt.moveTo(x, y);
            }
            this.handwritingX.push(x);
            this.handwritingY.push(y);
        };
            
        mouseMove = (e: MouseEvent) => {
            if (this.drawing && this.cxt) {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.cxt.lineTo(x, y);
                this.cxt.stroke();
                this.handwritingX.push(x);
                this.handwritingY.push(y);
            }
        };
            
        mouseUp = () => {
            const w = [];
            w.push(this.handwritingX);
            w.push(this.handwritingY);
            w.push([]);
            this.trace.push(w);
            this.drawing = false;
            const dataURL = this.canvas.toDataURL()
            if (this.allowUndo) this.step.push(dataURL);
        };
            
        touchStart = (e:TouchEvent) =>{
            e.preventDefault();
            if (this.cxt){
                this.cxt.lineWidth = this.lineWidth;
                this.cxt.strokeStyle = this.strokeStyle;
                this.handwritingX = [];
                this.handwritingY = [];
                const de = document.documentElement;
                const box = this.canvas.getBoundingClientRect();
                const top = box.top + window.scrollY - de.clientTop;
                const left = box.left + window.scrollX - de.clientLeft;
                const touch = e.changedTouches[0];
                const touchX = touch.pageX - left;
                const touchY = touch.pageY - top;
                this.handwritingX.push(touchX);
                this.handwritingY.push(touchY);
                this.cxt.beginPath();
                this.cxt.moveTo(touchX, touchY);
            }
        };
            
        touchMove = (e: TouchEvent) => {
            e.preventDefault();
            const touch = e.targetTouches[0];
            const de = document.documentElement;
            const box = this.canvas.getBoundingClientRect();
            const top = box.top + window.scrollY - de.clientTop;
            const left = box.left + window.scrollX - de.clientLeft;
            const x = touch.pageX - left;
            const y = touch.pageY - top;
            this.handwritingX.push(x);
            this.handwritingY.push(y);
            if (this.cxt){
                this.cxt.lineTo(x, y);
                this.cxt.stroke();
            }
        };
            
        touchEnd =() => {
            const w = [];
            w.push(this.handwritingX);
            w.push(this.handwritingY);
            w.push([]);
            this.trace.push(w);
            if (this.allowUndo) this.step.push(this.canvas.toDataURL());
        };
            
        undo = () => {
            if (!this.allowUndo || this.step.length <= 0) {
                return;
            }
            else if (this.step.length === 1) {
                if (this.allowRedo) {
                    this.redo_step.push(this.step.pop() ?? "");
                    this.redo_trace.push(this.trace.pop() ?? []);
                    if (this.cxt){
                        this.cxt.clearRect(0, 0, this.width, this.height);
                    }
                } else {
                    console.log(this.step)
                    if (this.cxt){
                        this.cxt.clearRect(0, 0, this.width, this.height);
                    }
                }
            } else {
                if (this.allowRedo) {
                    this.redo_step.push(this.step.pop() ?? "");
                    this.redo_trace.push(this.trace.pop() ?? []);
                } else {     
                    this.step.pop();
                    this.trace.pop();
                }
                this.loadFromUrl(this.step.slice(-1)[0], this);
            }
        };
            
        redo = () => {
            if (!this.allowRedo || this.redo_step.length <= 0) return;
            this.step.push(this.redo_step.pop()  ?? "");
            this.trace.push(this.redo_trace.pop()  ?? []);
            this.loadFromUrl(this.step.slice(-1)[0], this);
        };
            
        erase = () => {
            if (this.cxt){
                this.cxt.clearRect(0, 0, this.width, this.height);
            }
            this.step = [];
            this.redo_step = [];
            this.redo_trace = [];
            this.trace = [];
        };

        loadFromUrl = (url: string, cvs: HTMLCanvasElement) => {
            const imageObj = new Image();
            imageObj.onload = () => {
                cvs.cxt.clearRect(0, 0, this.width, this.height);
                cvs.cxt.drawImage(imageObj, 0, 0);
            };
            imageObj.src = url;
        }

    }
}

export default Handwriting;

// loadFromUrl = (url: string, cvs: HTMLCanvasElement) => {
//     const imageObj = new Image();
//     imageObj.onload = () => {
//         if (cvs){
//         const cxt = cvs.getContext('2d');
//         cxt.clearRect(0, 0, this.width, this.height);
//         cxt.drawImage(imageObj, 0, 0);
//         }
//     };
//     imageObj.src = url;
// }

// function loadFromUrl(url: string, cvs: CanvasType) {
//     const imageObj = new Image();
//     if (cvs){
//         imageObj.onload = () => {
//             cvs.cxt.clearRect(0, 0, this.width, this.height);
//             cvs.cxt.drawImage(imageObj, 0, 0);
//         };
//         imageObj.src = url;
//     }
// }

// function loadFromUrl(url: string, cvs: CanvasType) {
//     const imageObj = new Image();
//     imageObj.onload = () => {
//         cvs.cxt.clearRect(0, 0, this.width, this.height);
//         cvs.cxt.drawImage(imageObj, 0, 0);
//     };
//     imageObj.src = url;
// }


  