import { Game } from "@/atoms/gamesAtom";
import useGames from "@/hooks/useGames";
import { useDebounce } from "@uidotdev/usehooks";
import { useRouter } from "next/router";
import React, { useState } from "react";

type SearchInputProps = {
  customId: string;
  results: Game[];
  setResults: (games: Game[]) => void;
  setIsMyInputFocused: (isFocused: boolean) => void;
};

const SearchInput: React.FC<SearchInputProps> = ({
  customId,
  results,
  setResults,
  setIsMyInputFocused,
}) => {
  const { readGames } = useGames();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const router = useRouter();

  const onSubmit = async () => {
    router.push({ pathname: "/search", query: { search: searchTerm } });
    setSearchTerm("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  React.useEffect(() => {
    const searchHN = async () => {
      let results: Game[] = [];
      setIsSearching(true);
      if (debouncedSearchTerm) {
        const data = await readGames("games", searchTerm, undefined, true);
        results = data || [];
      }
      setIsSearching(false);
      setResults(results);
    };

    searchHN();
  }, [debouncedSearchTerm]);
  return (
    <form className="mr-4">
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only"
      >
        Search
      </label>
      <div className="relative w-96">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id={`${customId}-searchinput`}
          className="block  w-full p-4 pl-10 text-sm text-gray-900 rounded-lg border border-b-2 focus:outline-none hover:border-gray-800 align-middle items-center"
          placeholder="Search"
          onChange={handleChange}
          value={searchTerm}
          onBlur={() => {
            setTimeout(() => setIsMyInputFocused(false), 100);
          }}
          onFocus={() => setIsMyInputFocused(true)}
        />
        <button
          disabled={isSearching}
          type="submit"
          className="btn normal-case absolute right-2 bottom-[0.25rem]  font-medium rounded-lg text-sm"
          onClick={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          enter
        </button>
      </div>
    </form>
  );
};
export default SearchInput;
