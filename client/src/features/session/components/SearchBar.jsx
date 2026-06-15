import { Search } from "lucide-react";

const SearchBar = ({
    search,
    setSearch
}) => {
  return (
    <div className="relative w-[300px]">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
      />

      <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
        placeholder="Filter by label..."
        className="
          w-full
          bg-[#111114]
          border border-zinc-800
          rounded-xl
          py-2
          pl-11
          pr-4
          text-white
          outline-none
          focus:border-violet-500/30
        "
      />
    </div>
  );
};

export default SearchBar;