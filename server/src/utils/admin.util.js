export const getAdminEmails = () =>
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

export const isAdminEmail = (email) => {
  if (!email) return false;
  return getAdminEmails().includes(email.trim().toLowerCase());
};

export const resolveRoleForEmail = (email) =>
  isAdminEmail(email) ? "admin" : "user";
