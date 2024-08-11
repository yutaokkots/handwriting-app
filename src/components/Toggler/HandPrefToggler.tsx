import React from 'react'
import { HandPrefStore, useHandPrefStore } from '../../lib/store' 

const HandPrefToggler:React.FC = () => { 
    const { handPref }:HandPrefStore = useHandPrefStore();
    return (
        <> 
            <div className="flex b-10 justify-center">
                <div className={`flex justify-start items-center
                        relative  rounded-full w-11 h-6 bg-[#efeeee]
                        p-[2px]`}>
                    <div 
                        className={`
                            absolute w-5 h-5 bg-rose-600 rounded-full top-[2px]
                            ${ handPref == "right" ? 
                            "right-[2px]"
                            : "left-[2px]"}
                            `}>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HandPrefToggler