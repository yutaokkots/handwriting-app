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

/**
 * Sets and gets the handPref ('left', 'right') from localstorage.
 * 
 */

export const handPrefSetter = (handPref: 'left' | 'right') => {
    localStorage.setItem("handPref", handPref);
}

export const handPrefGetter = (): 'left' | 'right' => {
    const storedHandPref = typeof window != 'undefined' ? localStorage.getItem("handPref") : null;
    if (storedHandPref == null){
        return "right";
    } else {
        return storedHandPref as 'left' | 'right';
    }

}