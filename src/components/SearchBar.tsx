import { useEffect, useState } from "react";
import { Search } from "lucide-react";

type Props = {
  onSearch: (query: string) => void;
};

export const SearchBar = ({ onSearch }: Props) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    onSearch(query);
  }, [query, onSearch]);

  return (
    <div className="mb-3">
      <div className="flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Leaderboarders..."
          className="pl-1 w-[96.5%] py-2 outline-none  text-white bg-gray-500/40"
        />

        <button className="text-white bg-gray-500/40 px-3 py-2">
          <Search />
        </button>
      </div>
    </div>
  );
};
