import React, { useState, useEffect, forwardRef, InputHTMLAttributes } from 'react';
import { useSearchState, SearchState } from '../../lib/store';

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  inputRef: React.Ref<HTMLInputElement>;
}

const SearchBar: React.FC<SearchBarProps> = forwardRef(({ inputRef, ...rest }, ref) => {
  // Stores search query.
  const { searchState, searchStateSetter }: SearchState = useSearchState();
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    setInputValue(searchState);

    if (inputRef && inputRef.current) {
      inputRef.current.focus();
      const newPosition = inputRef.current.value.length;
      inputRef.current.setSelectionRange(newPosition, newPosition);
    }
  }, [inputValue, searchState]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    searchStateSetter(e.target.value);
  };

  return (
    <input
      id="search-input"
      onChange={handleChange}
      type="text"
      ref={inputRef}
      className="w-[380px] dark:bg-[--accent-color-dark] p-2 rounded-md"
      value={inputValue}
      {...rest}
    />
  );
});

const CopyButton: React.FC = () => {

    return (
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0 1 21 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 0 1 7.5 16.125V3.375Z" />
                <path d="M15 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 17.25 7.5h-1.875A.375.375 0 0 1 15 7.125V5.25ZM4.875 6H6v10.125A3.375 3.375 0 0 0 9.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V7.875C3 6.839 3.84 6 4.875 6Z" />
            </svg>
        </div>
    );
};

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputRef: React.Ref<HTMLInputElement>;
}

const SearchInput: React.FC<SearchInputProps> = forwardRef(({ inputRef, ...rest }, ref) => {
    
    // 'copied' useState
    useState

    // Copy to clipboard
    const copyToClipboard = () => {
        if (inputRef){
            navigator.clipboard.writeText(inputRef?.current.value)
        }
    }

    return (
        <>
            <div className="absolute text-6xl">
                <SearchBar inputRef={inputRef} {...rest} />
            </div>
            <button 
                onClick={copyToClipboard} 
                onTouchStart={copyToClipboard} 
                className="absolute m-2 right-0">
                <CopyButton />
            </button>
        </>
    );
});

export default SearchInput;
