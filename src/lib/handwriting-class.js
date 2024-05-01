class Handwriting {

    constructor(obj){
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
    static Canvas(cvs, theme){
        return new Canvas(cvs, theme);
    }
}

export default Handwriting;

class Canvas{
    constructor(cvs, theme){
        this.canvas = cvs;
        this.cxt = cvs.getContext("2d");
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

    set_Undo_Redo = function (undo, redo) {
        this.allowUndo = undo;
        this.allowRedo = undo ? redo : false;
        if (!this.allowUndo) {
            this.step = [];
            this.redo_step = [];
            this.redo_trace = [];
        }
    };

    setLineWidth = function (lineWidth) {
        this.lineWidth = lineWidth;
    };
      
    setCallBack = function (callback) {
        this.callback = callback;
    };
      
    setOptions = function (options) {
        this.options = options;
    };
      
    mouseDown = function (e) {
        // new stroke
        this.cxt.strokeStyle = this.strokeStyle;
        this.cxt.lineWidth = this.lineWidth;
        this.handwritingX = [];
        this.handwritingY = [];
        this.drawing = true;
        this.cxt.beginPath();
        var rect = this.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        this.cxt.moveTo(x, y);
        this.handwritingX.push(x);
        this.handwritingY.push(y);
    };
      
    mouseMove = function (e) {
        if (this.drawing) {
            var rect = this.canvas.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            this.cxt.lineTo(x, y);
            this.cxt.stroke();
            this.handwritingX.push(x);
            this.handwritingY.push(y);
        }
    };
      
    mouseUp = function () {
        var w = [];
        w.push(this.handwritingX);
        w.push(this.handwritingY);
        w.push([]);
        this.trace.push(w);
        this.drawing = false;
        if (this.allowUndo) this.step.push(this.canvas.toDataURL());
    };
      
    touchStart = function (e) {
        e.preventDefault();
        this.cxt.lineWidth = this.lineWidth;
        this.cxt.strokeStyle = this.strokeStyle;
        this.handwritingX = [];
        this.handwritingY = [];
        var de = document.documentElement;
        var box = this.canvas.getBoundingClientRect();
        var top = box.top + window.pageYOffset - de.clientTop;
        var left = box.left + window.pageXOffset - de.clientLeft;
        var touch = e.changedTouches[0];
        var touchX = touch.pageX - left;
        var touchY = touch.pageY - top;
        this.handwritingX.push(touchX);
        this.handwritingY.push(touchY);
        this.cxt.beginPath();
        this.cxt.moveTo(touchX, touchY);
    };
      
    touchMove = function (e) {
        e.preventDefault();
        var touch = e.targetTouches[0];
        var de = document.documentElement;
        var box = this.canvas.getBoundingClientRect();
        var top = box.top + window.pageYOffset - de.clientTop;
        var left = box.left + window.pageXOffset - de.clientLeft;
        var x = touch.pageX - left;
        var y = touch.pageY - top;
        this.handwritingX.push(x);
        this.handwritingY.push(y);
        this.cxt.lineTo(x, y);
        this.cxt.stroke();
    };
      
    touchEnd = function (e) {
        var w = [];
        w.push(this.handwritingX);
        w.push(this.handwritingY);
        w.push([]);
        this.trace.push(w);
        if (this.allowUndo) this.step.push(this.canvas.toDataURL());
    };
      
    undo = function () {
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
            loadFromUrl(this.step.slice(-1)[0], this);
        }
    };
      
    redo = function () {
        if (!this.allowRedo || this.redo_step.length <= 0) return;
        this.step.push(this.redo_step.pop());
        this.trace.push(this.redo_trace.pop());
        loadFromUrl(this.step.slice(-1)[0], this);
    };
      
    erase = function () {
        this.cxt.clearRect(0, 0, this.width, this.height);
        this.step = [];
        this.redo_step = [];
        this.redo_trace = [];
        this.trace = [];
    };
}

function loadFromUrl(url, cvs) {
    var imageObj = new Image();
    imageObj.onload = function () {
      cvs.cxt.clearRect(0, 0, this.width, this.height);
      cvs.cxt.drawImage(imageObj, 0, 0);
    };
    imageObj.src = url;
}
  