import { useEffect, useState } from "react";

import SearchInput from "./organisms/SearchInput";
import SearchResponseRenderer from "./organisms/SearchResponse";

import { mockSearch } from "./api/mockSearchApi";

const SearchContainer = () => {
  const [searchText, setSearchText] = useState("");

  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const data = await mockSearch(searchText);
      setResults(data);
    }
    load();
  }, [searchText]);

  return (
    <>
      <SearchInput searchText={searchText} setSearchText={setSearchText} />
      <SearchResponseRenderer searchResponse={results} />
    </>
  );
};

export default SearchContainer;
