import React, { useState, useEffect } from 'react'
import { useWorkerStore } from '../../lib/store';
import { useSearchState, SearchState } from '../../lib/store';

const SearchResult:React.FC = () => {
    // Global store that holds the worker thread in the 'workerState'
    const { workerState, setWorkerState } = useWorkerStore()     

    // Global store that holds the search term in the search-bar
    const { searchState, setSearchState } = useSearchState();

    const [kanaYomi, setKanaYomi] = useState<string>("");

    useEffect(() => {
        if (workerState){
            workerState.onmessage = (e) => {
                const {success, data, error} = e.data;
                if (success) {
                    setKanaYomi(data)
                } else{
                    console.error("Error from worker:", error)
                }
            }   
        }
        return () => {
            if (workerState){
                workerState.terminate();
            }
          };
    }, [workerState])

    useEffect(() => {
        if (workerState && searchState) {
            workerState.postMessage({action: 'searchKanji', data:searchState})
        }
        // this useEffect responsive to change in searchState state;
        // when the searchState is changed, then the worker object (worker thread)
        //      is triggered to search for the yomi
        // then the kanaYomi state is set using the result. 
    }, [searchState, workerState])
    
    return (
        <div>{kanaYomi}</div>
    )
}

export default SearchResult