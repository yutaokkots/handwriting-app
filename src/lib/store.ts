/** 
 * Code to establish state management by Zustand.
 * See zustand-demo.pmnd.rs/ for details.
 */ 
import { create } from 'zustand'

/** 
* State for the dark/light theme for the site.
* @state {'dark'|'light'|null} themeState - represents the strings, 'dark' or 'light'.
* @function themeToggler - switches the theme state between 'dark' and 'light'.
* @function themeStateSetter - sets the theme state. 
*/

export interface ThemeState {
    themeState: 'dark' | 'light';
    themeStateSetter: (theme:'dark'|'light') => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
    themeState: 'light',
    themeStateSetter: (theme) => {
        set({
            themeState: theme
        })
    } 
}))