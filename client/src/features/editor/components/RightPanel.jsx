const RightPanel = () => {
  return (
    <aside
      className="
        w-[350px]
        border-l
        border-zinc-800
        bg-[#111114]
        flex
        flex-col
      "
    >
      {/* Tabs */}
      <div
        className="
          h-11
          border-b
          border-zinc-800
          flex
        "
      >
        <Tab active>
          AI Review
        </Tab>

        <Tab>
          Chat
        </Tab>

        <Tab>
          Activity
        </Tab>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 overflow-auto">
        <PanelCard title="Quality Score">
          94%
        </PanelCard>

        <PanelCard title="Performance Hint">
          Multiple unnecessary renders detected.
        </PanelCard>

        <PanelCard title="Security Issue">
          Potential XSS vulnerability found.
        </PanelCard>

        <PanelCard title="AI Recommendation">
          Consider memoizing expensive calculations.
        </PanelCard>
      </div>
    </aside>
  );
};

const Tab = ({
  children,
  active,
}) => {
  return (
    <button
      className={`
        flex-1
        text-sm
        font-medium

        ${
          active
            ? "text-violet-400 border-b-2 border-violet-500"
            : "text-zinc-500"
        }
      `}
    >
      {children}
    </button>
  );
};

const PanelCard = ({
  title,
  children,
}) => {
  return (
    <div
      className="
        bg-zinc-900
        border
        border-zinc-800
        rounded-xl
        p-4
      "
    >
      <h4 className="text-sm font-medium mb-2">
        {title}
      </h4>

      <p className="text-zinc-400 text-sm">
        {children}
      </p>
    </div>
  );
};

export default RightPanel;