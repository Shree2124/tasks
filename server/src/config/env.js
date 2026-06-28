import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../../.env");

// On Vercel, use Project → Settings → Environment Variables (no .env file on disk)
if (!process.env.VERCEL) {
  const result = dotenv.config({ path: envPath });
  if (result.error && process.env.NODE_ENV !== "test") {
    console.warn(
      `[env] No local .env at ${envPath}. Use server/.env locally or Vercel env vars in production.`
    );
  }
}

export { envPath };
