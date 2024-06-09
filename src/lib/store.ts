/** 
 * Code to establish state management by Zustand.
 * See zustand-demo.pmnd.rs/ for details.
 */ 
import { create } from 'zustand'

/** 
* State for the dark/light theme for the site.
* @state {'dark'|'light'|null} themeState - represents the strings, 'dark' or 'light'.
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

/** 
* State for the Search State and Suggestion State. 
* @state suggestionState - 
* @function suggestionStateSetter - 
* @state searchState - String state for the search term that is found in the search bar (SearchInput.tsx).
* @function searchStateSetter - Sets the searchState. 
*/

export interface SearchState {
    suggestionState: string;
    suggestionStateSetter: (suggested:string) => void;
    searchState: string;
    searchStateSetter: (prompt:string) => void;
}

export const useSearchState = create<SearchState>((set) => ({
    suggestionState: "",
    suggestionStateSetter: (suggest) => {
            set({
                suggestionState: suggest
            })
        },
    searchState: "",
    searchStateSetter: (searchState) => {
        set({
            searchState: searchState
        })
    }
}))


/** 
* State for the absurd-sql worker object (the worker thread).
* @state workerState - represents the worker object thread.
* @function workerStateSetter - sets the workerState.
*/

export interface WorkerStore {
    workerState: Worker | null;
    setWorkerState: (worker: Worker | null) => void;
}

export const useWorkerStore = create<WorkerStore>((set) => ({
    workerState: null,
    setWorkerState: (worker) => 
        set({ 
            workerState: worker 
        })
}))
