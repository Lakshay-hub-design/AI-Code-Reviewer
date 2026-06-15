const StatsCard = ({
  title,
  value,
  label,
  icon: Icon,
  accentColor = "text-violet-400",
}) => {
  return (
    <div
      className="
        bg-[#111114]
        border border-zinc-800
        rounded-2xl
        p-4
        hover:border-violet-500/20
        hover:shadow-[0_0_25px_rgba(168,85,247,0.08)]
        transition-all
      "
    >
      {/* Top Row */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-500 font-semibold tracking-wide">
          {title}
        </p>

        <Icon size={18} className={accentColor} />
      </div>

      {/* Value Row */}
      <div className="flex items-end gap-2 mt-5">
        <h3 className="text-3xl font-bold text-white leading-none">
          {value}
        </h3>

        <span
          className={`text-sm font-semibold mb-1 ${accentColor}`}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

export default StatsCard;