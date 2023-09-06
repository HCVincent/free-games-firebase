import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Game } from "@/atoms/gamesAtom";
import useGames from "@/hooks/useGames";
type indexProps = {};

const Page: React.FC<indexProps> = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Game[]>([]);
  const { readGames } = useGames();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  useEffect(() => {
    const searchHN = async () => {
      if (search) {
        let results: Game[] = [];
        setIsSearching(true);
        const data = await readGames("games", search, 10, true);
        results = data || [];
        setIsSearching(false);
        setResults(results);
      }
    };

    searchHN();
  }, [search]);

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full justify-center items-center">
      {isSearching ? (
        <span className="loading loading-spinner loading-lg "></span>
      ) : (
        <div className="flex h-full w-full">
          {results && results.length > 0 ? (
            <>{results.length}</>
          ) : (
            <div className="flex h-full w-full justify-center items-center">
              there is no data for {search}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default Page;
