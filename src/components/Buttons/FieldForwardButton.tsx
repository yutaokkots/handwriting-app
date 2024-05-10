import React from 'react'

const FieldForwardButton:React.FC = () => {
    return (
        <button
            className="bg-amber-600 rounded-md w-[35px] h-[110px] flex justify-center items-center">
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

export default FieldForwardButton