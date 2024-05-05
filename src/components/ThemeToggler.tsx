import React, { useEffect } from 'react'
import { useThemeStore, ThemeState } from "../lib/store.ts";
import { themeGetter, themeSetter } from '../utilities/themeSetterGetter.ts';

const ThemeToggler:React.FC = () => {
    const { themeState, themeStateSetter }:ThemeState = useThemeStore() 

    const toggleTheme = () => {
        const theme = themeState == "light" ? "dark" : "light"
        themeStateSetter(theme)
        themeSetter(theme)
    }

    useEffect(() => {
        document.documentElement.className = themeGetter() 
    }, [themeState])

    return (
        <button onClick={toggleTheme}>Dark/Light</button>
    )
}

export default ThemeToggler