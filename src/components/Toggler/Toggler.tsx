import React from 'react'
import './toggler.css'

const Toggler:React.FC = () => {
    return (
        <div className="flex b-10 justify-center">
            <div className="theme-light-ext dark:theme-dark-ext ">
                <div className="dark:theme-dark-outer">
                    <div className="theme-light-sun dark:theme-dark-moon"></div>
                </div>
            </div>
        </div>
    )
}

export default Toggler