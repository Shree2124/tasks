/**
 * Masks email for admin views: john.doe@example.com → j***@example.com
 */
export const maskEmail = (email) => {
  if (!email || typeof email !== "string") return "—";
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  const visible = local.length > 0 ? local[0] : "";
  return `${visible}***@${domain}`;
};

export const toDisplayName = (user) => {
  const parts = [user.firstName, user.lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : user.username ?? "User";
};
