import React, { DOMElement, useRef } from "react";

type SearchInputProps = {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
};

const SearchInput: React.FC<SearchInputProps> = ({
  searchText,
  setSearchText,
}) => {
  const timeoutRef = useRef<undefined | number>();
  const inputRef = useRef<null | HTMLInputElement>(null);
  const debouncedInputHandler = (e) => {
    if (!inputRef?.current) return;
    const { value } = inputRef.current;
    clearTimeout(timeoutRef.current);
    console.log(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      console.log("set", value);
      setSearchText(value);
    }, 300);
  };

  return (
    <input
      type="text"
      ref={inputRef}
      onChange={debouncedInputHandler}
      placeholder="Search..."
    />
  );
};

export default SearchInput;
