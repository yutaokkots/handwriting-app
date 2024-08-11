import React from 'react'

interface TogglerProps {
    togglerFunction: () => void;
    TogglerComponent: React.ComponentType;
}

const Toggler:React.FC<TogglerProps> = ({ togglerFunction, TogglerComponent }) => {
    const handleClick = () => {
        togglerFunction();
    }
    return (
        <>
            <button
                onClick={handleClick}>
                <TogglerComponent/>
            </button>
        </>
    )
}

export default Toggler;
