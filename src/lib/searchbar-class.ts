class Searchbar {
    _wrapped: unknown;
    obj: unknown;

    // Instantiates an object with or without the 'new' keyword/
    constructor (obj: Searchbar | null){
        if (obj instanceof Searchbar){
            return obj;
        } 
        if (!(this instanceof Searchbar)){
            return new Searchbar(obj);
        }
        this._wrapped = obj
    }
    static Input = class {
        
        constructor(){

        }
    }

}

export default Searchbar;