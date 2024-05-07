/**
 * Sets and gets the theme ('dark', 'light') from localstorage.
 * 
 */

export const themeSetter = (theme: 'dark'|'light') => {
    localStorage.setItem("theme", theme);
}

export const themeGetter = ():'dark'|'light' => {
    const storedTheme = typeof window !== 'undefined'? localStorage.getItem("theme") : null;
    if (storedTheme == null) {
        return "light";
    } else {
        return storedTheme as 'light' | 'dark';
    }
}