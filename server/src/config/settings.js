import "./env.js";

const databaseUrl = process.env.MONGODB_URL;
const databaseName = process.env.DB_NAME;
const PORT = process.env.PORT;
const corsOrigin = process.env.CORS_ORIGIN;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;
const jwtSecret = process.env.JWT_SECRET;
const email = process.env.EMAIL_ADDRESS;
const password = process.env.EMAIL_PASSWORD;
const frontend_url = process.env.FRONTEND_URL;
const backend_url = process.env.BACKEND_URL;

const isProduction = process.env.NODE_ENV === "production";

const options = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};

export {
  databaseName,
  databaseUrl,
  PORT,
  corsOrigin,
  accessTokenExpiry,
  accessTokenSecret,
  refreshTokenExpiry,
  refreshTokenSecret,
  jwtSecret,
  options,
  email,
  password,
  frontend_url,
  backend_url,
};
