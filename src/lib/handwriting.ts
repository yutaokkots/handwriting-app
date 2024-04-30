/**  
 * Handwriting class in typescript, based on:
 * https://github.com/gabor-kovacs/the-kanji-map/blob/main/lib/handwriting.js
 * and
 * https://github.com/ChenYuHo/handwriting.js
**/

class Handwriting {
    _wrapped:  unknown;

    constructor(obj:unknown){
        if (obj instanceof Handwriting) return obj;
        if (!(this instanceof Handwriting)) return new Handwriting(obj);
        this._wrapped = obj;
    }
}

export default Handwriting;

class Canvas {
    canvas: HTMLCanvasElement;
    cxt: CanvasRenderingContext2D;
    lineWidth: number;
    strokeStyle: string;
    width: number;
    height: number;
    drawing: boolean;
    handwritingX: number[];
    handwritingY: number[];
    trace: number[][][];
    options: HandwritingOptions;
    step: string[];
    redo_step: string[];
    redo_trace: number[][][];
    allowUndo: boolean;
    allowRedo: boolean;
    callback: Function | undefined;


    constructor(cvs: HTMLCanvasElement, theme: string) {
        this.canvas = cvs;
        this.cxt = cvs.getContext("2d")!;
        this.strokeStyle = theme === "dark" ? "#fff" : "#1f1f1f";
        this.cxt.lineCap = "round";
        this.cxt.lineJoin = "round";
        this.lineWidth = 3;
        this.width = cvs.width;
        this.height = cvs.height;
        this.drawing = false;
        this.handwritingX = [];
        this.handwritingY = [];
        this.trace = [];
        this.options = {};
        this.step = [];
        this.redo_step = [];
        this.redo_trace = [];
        this.allowUndo = false;
        this.allowRedo = false;
        cvs.addEventListener("mousedown", this.mouseDown.bind(this));
        cvs.addEventListener("mousemove", this.mouseMove.bind(this));
        cvs.addEventListener("mouseup", this.mouseUp.bind(this));
        cvs.addEventListener("touchstart", this.touchStart.bind(this));
        cvs.addEventListener("touchmove", this.touchMove.bind(this));
        cvs.addEventListener("touchend", this.touchEnd.bind(this));
        this.callback = undefined;
        this.recognize = handwriting.recognize;
    }  
    set_Undo_Redo(undo: boolean, redo: boolean) {
        this.allowUndo = undo;
        this.allowRedo = undo ? redo : false;
        if (!this.allowUndo) {
            this.step = [];
            this.redo_step = [];
            this.redo_trace = [];
        }
    }

    setLineWidth = (lineWidth: number) => {
        this.lineWidth = lineWidth;
    };
    
    setCallBack = (callback: Function) => {
        this.callback = callback;
    };
    
    setOptions = (options) => {
        this.options = options;
    };
        
    mouseDown = (e: MouseEvent) => {
        // new stroke
        this.cxt.strokeStyle = this.strokeStyle;
        this.cxt.lineWidth = this.lineWidth;
        this.handwritingX = [];
        this.handwritingY = [];
        this.drawing = true;
        this.cxt.beginPath();
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.cxt.moveTo(x, y);
        this.handwritingX.push(x);
        this.handwritingY.push(y);
      };
      
      mouseMove = (e: MouseEvent) => {
        if (this.drawing) {
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
        if (this.allowUndo) this.step.push(this.canvas.toDataURL());
      };
      
      touchStart = (e: TouchEvent) => {
        e.preventDefault();
        this.cxt.lineWidth = this.lineWidth;
        this.cxt.strokeStyle = this.strokeStyle;
        this.handwritingX = [];
        this.handwritingY = [];
        const de = document.documentElement;
        const box = this.canvas.getBoundingClientRect();
        const top = box.top + window.pageYOffset - de.clientTop;
        const left = box.left + window.pageXOffset - de.clientLeft;
        const touch = e.changedTouches[0];
        const touchX = touch.pageX - left;
        const touchY = touch.pageY - top;
        this.handwritingX.push(touchX);
        this.handwritingY.push(touchY);
        this.cxt.beginPath();
        this.cxt.moveTo(touchX, touchY);
      };
      
      touchMove = (e: TouchEvent) => {
        e.preventDefault();
        const touch = e.targetTouches[0];
        const de = document.documentElement;
        const box = this.canvas.getBoundingClientRect();
        const top = box.top + window.pageYOffset - de.clientTop;
        const left = box.left + window.pageXOffset - de.clientLeft;
        const x = touch.pageX - left;
        const y = touch.pageY - top;
        this.handwritingX.push(x);
        this.handwritingY.push(y);
        this.cxt.lineTo(x, y);
        this.cxt.stroke();
      };
      
      touchEnd = () => {
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
            this.redo_step.push(this.step.pop());
            this.redo_trace.push(this.trace.pop());
            this.cxt.clearRect(0, 0, this.width, this.height);
          }
        } else {
          if (this.allowRedo) {
            this.redo_step.push(this.step.pop());
            this.redo_trace.push(this.trace.pop());
          } else {
            this.step.pop();
            this.trace.pop();
          }
          this.loadFromUrl(this.step.slice(-1)[0], this);
        }
      };
      
      redo = () => {
        if (!this.allowRedo || this.redo_step.length <= 0) return;
        this.step.push(this.redo_step.pop());
        this.trace.push(this.redo_trace.pop());
        this.loadFromUrl(this.step.slice(-1)[0], this);
      };
      
      erase = () => {
        this.cxt.clearRect(0, 0, this.width, this.height);
        this.step = [];
        this.redo_step = [];
        this.redo_trace = [];
        this.trace = [];
      };

      loadFromUrl = (url, cvs) => {
        const imageObj = new Image();
        imageObj.onload = function () {
          cvs.cxt.clearRect(0, 0, this.width, this.height);
          cvs.cxt.drawImage(imageObj, 0, 0);
        };
        imageObj.src = url;
      }

      recognize = (trace, options, callback) => {
        const data = JSON.stringify({
          options: "enable_pre_space",
          requests: [
            {
              writing_guide: {
                writing_area_width: options.width || this.width || undefined,
                writing_area_height: options.height || this.width || undefined,
              },
              ink: trace,
              language: options.language || "zh_TW",
            },
          ],
        });
      
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {
            let response;
            let results;
            switch (this.status) {
              case 200:
                response = JSON.parse(this.responseText);
                if (response.length === 1) {
                  callback(undefined, new Error(response[0]));
                  break;
                } else results = response[1][0][1];
                if (!!options.numOfWords) {
                  results = results.filter(function (result) {
                    return result.length == options.numOfWords;
                  });
                }
                if (!!options.numOfReturn) {
                  results = results.slice(0, options.numOfReturn);
                }
                callback(results, undefined);
                break;
              case 403:
                callback(undefined, new Error("access denied"));
                break;
              case 503:
                callback(undefined, new Error("can't connect to recognition server"));
                break;
            }
          }
        });
        xhr.open(
          "POST",
          "https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8"
        );
        xhr.setRequestHeader("content-type", "application/json");
        xhr.send(data);
      };

}

