import React, { useEffect } from 'react'
import ThemeToggler from '../Toggler/ThemeToggler'
import HandPrefToggler from '../Toggler/HandPrefToggler.tsx'
import Toggler from '../Toggler/Toggler';
import { useThemeStore, ThemeState, HandPrefStore, useHandPrefStore } from "../../lib/store.ts";
import { themeGetter, themeSetter, handPrefSetter } from '../../utilities/localhostSetterGetter.ts';

interface SettingsProps {
    showSettings: boolean;
}
const Settings:React.FC<SettingsProps> = ({ showSettings }) => {
    // Gets themeState (state) and themeStateSetter (setter function) from store.ts.
    const { themeState, themeStateSetter }:ThemeState = useThemeStore();
    // Gets handPref (state) and setHandPref (setter function) for left or right hand preferences.
    const { handPref, setHandPref }:HandPrefStore = useHandPrefStore();
    
    useEffect(() => {
        document.documentElement.className = themeGetter()     
    }, [themeState])

    const toggleTheme = () => {
        const theme = themeState == "light" ? "dark" : "light"
        // Sets the theme into the Zustand Store.
        themeStateSetter(theme);
        // Sets theme into localhost.
        themeSetter(theme);  
    }
    
    const toggleHandPref = () => {
        const pref = handPref == "right" ? "left" : "right"
        // Sets the hand preference into the Zustand Store.
        setHandPref(pref);
        // Sets handPref into localhost.
        handPrefSetter(pref)
    }

    return (
        <>
            {showSettings && 
                <ul className="w-40 absolute top-2 bg-orange-300 rounded-b-lg z-20"> 
                    <li className="hover:bg-orange-500 px-2 justify-between flex items-center" >
                        <div
                            className="h-10 flex items-center">
                        Light/Dark 
                        </div>
                        <div className="h-10 flex items-center">
                            <Toggler 
                                togglerFunction={toggleTheme}
                                TogglerComponent={ThemeToggler}
                                />
                        </div>
                    </li>
                    <li className="hover:bg-orange-500  hover:rounded-b-lg px-2 flex justify-between items-center" >
                        <div
                            className="h-10 flex items-center ">
                        Left/Right
                        </div>
                        <div className="h-10 flex items-center ">
                            <Toggler 
                                togglerFunction={toggleHandPref}
                                TogglerComponent={HandPrefToggler }
                                />
                        </div>
                    </li>
                </ul>
            }
        </>
    )
}

export default Settings