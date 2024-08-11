import React from 'react'
import './toggler.css'

const ThemeToggler:React.FC = () => {
    return (
        <> 
            <div className="flex b-10 justify-center">
                <div className="
                        flex justify-start items-center
                        relative bg-[#87CEEB] w-11 h-6
                        p-[2px] rounded-full
                        dark:w-11
                        dark:h-6
                        dark:rounded-full 
                        dark:bg-[#efeeee]">
                    <div 
                        className="
                            absolute
                            dark:w-5
                            dark:h-5
                            bg-[#4c5255]
                            dark:rounded-full
                            dark:top-[2px]
                            dark:right-[2px]
                        ">
                        <div 
                            className="
                                absolute w-5 h-5 bg-[#FFFF00] 
                                rounded-full left-[1px] -top-[10px]
                                dark:absolute
                                dark:bg-[#efeeee]
                                dark:bg-transparent
                                dark:shadow-[6px_4px_0_0_#fff]
                                dark:h-4
                                dark:w-4
                                dark:-top-[2px]
                                dark:-left-[3.5px]
                                "></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ThemeToggler