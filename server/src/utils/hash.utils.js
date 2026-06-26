import crypto from "crypto";

export const generateCodeHash = (
  code
) => {
  return crypto
    .createHash("sha256")
    .update(code)
    .digest("hex");
};