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

        // this useEffect responsive to change in searchState state;
        // when the searchState is changed, then the worker object (worker thread)
        //      is triggered to search for the yomi
        // then the kanaYomi state is set using the result. 
    }, [searchState])
    
    return (
        <div>example kana yomi</div>
    )
}

export default SearchResult