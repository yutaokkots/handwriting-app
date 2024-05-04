import React, { useState, useEffect } from 'react'

const ThemeToggler:React.FC = () => {
    const [theme, setTheme] = useState<"dark" | "light">("light");
    
    const toggleTheme = () => {
        setTheme(theme == "light"? "dark" : "light")
    }

    useEffect(() => {
        document.documentElement.className = theme;
    }, [theme])

    return (
        <button onClick={toggleTheme}>Dark/Light</button>
    )
}

export default ThemeToggler