import React from 'react'
import { useSearchState, SearchState } from '../../lib/store';
import DeleteButton from '../Buttons/DeleteButton';
import TrashButton from '../Buttons/TrashButton';

interface inputDisplayControllerProps {
    deleteChar: () => void;
}


const FieldBackButton:React.FC = () => {
    return (
        <button
            className=" rounded-md flex justify-center items-center w-full border-2 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth="1.5" 
                stroke="currentColor" 
                className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
        </button>
    )
}

const FieldForwardButton:React.FC = () => {
    return (
        <button
            className="rounded-md flex justify-center items-center border-2 w-full border-white">
                <svg xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth="1.5" 
                    stroke="currentColor" 
                    className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
        </button>
    )
}

const InputDisplayController:React.FC<inputDisplayControllerProps> = ({ deleteChar }) => {
    const { searchState, searchStateSetter }: SearchState = useSearchState();

    const handleClick = () => {
        deleteChar()
    }

    return (
        <>
            <div className="col-span-2">
                <button className="rounded-md flex justify-center items-center border-2 w-full border-white">
                    <TrashButton />
                </button>
            </div>
            <div className="col-span-4">
                <FieldBackButton />
            </div>
            <div className="col-span-4">
                <FieldForwardButton />
            </div>
            <div 
                className="col-span-2"
                onClick={handleClick}>
                <button className="rounded-md flex justify-center items-center border-2 w-full border-white">
                    <DeleteButton />    
                </button>
            </div>
        </>
    )
}

export default InputDisplayController