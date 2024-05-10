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
    </div>
  );
};

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputRef: React.Ref<HTMLInputElement>;
}

const SearchInput: React.FC<SearchInputProps> = forwardRef(({ inputRef, ...rest }, ref) => {
  return (
    <>
      <div className="absolute text-6xl">
        <SearchBar inputRef={inputRef} {...rest} />
      </div>
      <button className="absolute m-2 right-0">
        <CopyButton />
      </button>
    </>
  );
});

export default SearchInput;
