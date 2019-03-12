import { createError } from "apollo-errors";

const AccessDeniedError = createError("AccessDeniedError", {
    message: "Access Denied(403)."
});

export { AccessDeniedError }