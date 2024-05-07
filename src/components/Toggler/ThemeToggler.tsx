import React, { useEffect } from 'react'
import { useThemeStore, ThemeState } from "../../lib/store.ts";
import { themeGetter, themeSetter } from '../../utilities/themeSetterGetter.ts';
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

const ThemeToggler:React.FC = () => {
    // Gets themeState (state) and themeStateSetter (setter function) from store.ts.
    const { themeState, themeStateSetter }:ThemeState = useThemeStore() 

    const toggleTheme = () => {
        const theme = themeState == "light" ? "dark" : "light"
        themeStateSetter(theme);
        // Sets theme into localhost.
        themeSetter(theme);  
    }

    useEffect(() => {
        document.documentElement.className = themeGetter()     
    }, [themeState])

    return (
        <button onClick={toggleTheme}>
            <Toggler></Toggler>
        </button>
    )
}

export default ThemeToggler