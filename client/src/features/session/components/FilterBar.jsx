const filters = [
  { label: "All", value: "" },
  { label: "Public", value: "public" },
  { label: "Private", value: "private" },
];

const FilterBar = ({
  visibility,
  setVisibility,
}) => {
  return (
    <div className="flex gap-3">
      {filters.map((filter) => (
        <button
          key={filter.label}
          onClick={() => setVisibility(filter.value)}
          className={`
            px-4 py-1.5 rounded-full font-medium transition
            ${
              visibility === filter.value
                ? "bg-violet-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
            }
          `}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;