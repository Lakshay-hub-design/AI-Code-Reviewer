import Session from "../models/Session.js";

const saveTimers = new Map();

export const scheduleSave = (
  sessionId,
  ydoc
) => {
  clearTimeout(
    saveTimers.get(sessionId)
  );

  saveTimers.set(
    sessionId,
    setTimeout(async () => {
      try {
        const code =
          ydoc
            .getText("content")
            .toString();

        await Session.findByIdAndUpdate(
          sessionId,
          {
            code,
            lastEditedAt:
              new Date(),
          }
        );

        console.log(
          "saved:",
          sessionId
        );
      } catch (err) {
        console.error(
          err
        );
      }
    }, 2000)
  );
};

export const saveNow = async (
  sessionId,
  ydoc
) => {
  const code =
    ydoc.getText("content").toString();

  await Session.findByIdAndUpdate(
    sessionId,
    {
      code,
      lastEditedAt: new Date(),
    }
  );
};