import SessionRow from "./SessionRow";

const SessionList = ({ sessions }) => {
  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <SessionRow
          key={session._id}
          session={session}
        />
      ))}
    </div>
  );
};

export default SessionList;