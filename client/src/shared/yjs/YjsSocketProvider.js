import * as Y from "yjs";
import { getSocket } from "../socket/socket";

export class YjsSocketProvider {
  constructor({ sessionId, ydoc }) {
    console.log("provider created", sessionId);
    this.sessionId = sessionId;

    this.ydoc = ydoc;

    this.socket = getSocket();

    this.isApplyingRemote = false;

    this.handleRemoteUpdate = (update) => {
      console.log("recevied yjs update");
      this.isApplyingRemote = true;

      Y.applyUpdate(this.ydoc, new Uint8Array(update));

      this.isApplyingRemote = false;
    };

    this.socket.on("yjs-update", this.handleRemoteUpdate);

    this.handleInitialSync = (update) => {
  this.isApplyingRemote = true;

  Y.applyUpdate(
    this.ydoc,
    new Uint8Array(update)
  );

  this.isApplyingRemote = false;
};

    this.socket.on("yjs-sync", this.handleInitialSync);
    this.ydoc.on("update", this.handleLocalUpdate);
  }

  handleLocalUpdate = (update) => {
    if (this.isApplyingRemote) {
      return;
    }

    console.log("sending yjs update");

    this.socket.emit("yjs-update", {
      sessionId: this.sessionId,

      update: Array.from(update),
    });
  };
  destroy() {
    this.socket.off("yjs-update", this.handleRemoteUpdate);
    this.socket.off("yjs-sync", this.handleInitialSync);

    this.ydoc.off("update", this.handleLocalUpdate);
  }
}