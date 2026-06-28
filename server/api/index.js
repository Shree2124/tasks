import mongoose from "mongoose";
import "../src/config/env.js";
import { app } from "../src/app.js";
import { databaseName, databaseUrl } from "../src/config/settings.js";

let connectionPromise = null;

const connectDatabase = () => {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve();
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    const baseUrl = (databaseUrl ?? "").replace(/\/$/, "");
    if (!baseUrl) {
      throw new Error(
        "MONGODB_URL is not set. Add it in Vercel → Settings → Environment Variables."
      );
    }

    const connectionUri = `${baseUrl}/${databaseName ?? "todo"}`;
    await mongoose.connect(connectionUri);
  })();

  return connectionPromise;
};

export default async function handler(req, res) {
  try {
    await connectDatabase();
    return app(req, res);
  } catch (error) {
    console.error("Vercel handler error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message ?? "Internal server error",
    });
  }
}
