import React from 'react'
import { useSearchState, SearchState } from '../../lib/store';
import DeleteButton from '../Buttons/DeleteButton';
import TrashButton from '../Buttons/TrashButton';
import FieldForwardButton from '../Buttons/FieldForwardButton';
import FieldBackButton from '../Buttons/FieldBackButton';

interface inputDisplayControllerProps {
    deleteChar: () => void;
    inputRef: React.Ref<HTMLInputElement>;
    deleteInputField: () => void;
}



const InputDisplayController:React.FC<inputDisplayControllerProps> = ({ deleteChar, deleteInputField }) => {
    const { searchState, searchStateSetter }: SearchState = useSearchState();

    const handleDeleteChar = () => {
        deleteChar()
    }

    const handleDeleteInputField = () => {
        deleteInputField()
    }

    return (
        <>
            <div className="col-span-2">
                <button 
                    onClick={handleDeleteInputField}
                    className="disabled:opacity-40 rounded-md flex justify-center items-center border-2 w-full border-white"
                    disabled={ searchState == ""}>
                    <TrashButton />
                </button>
            </div>
            <div className="col-span-4">
                <button
                    className="disabled:opacity-40 rounded-md flex justify-center items-center border-2 w-full border-white"
                    disabled={ searchState == ""}>
                    <FieldBackButton />
                </button>
            </div>
            <div className="col-span-4">
                <button
                    className="disabled:opacity-40 rounded-md flex justify-center items-center border-2 w-full border-white"
                    disabled={ searchState == ""}>
                    <FieldForwardButton />
                </button>
            </div>
            <div 
                className="col-span-2">
                <button 
                    onClick={handleDeleteChar}
                    className="disabled:opacity-40 rounded-md flex justify-center items-center border-2 w-full border-white"
                    disabled={ searchState == ""}>
                    <DeleteButton />    
                </button>
            </div>
        </>
    )
}

export default InputDisplayController