import mongoose from "mongoose";
import dns from "dns";
import "../config/env.js";
import { databaseName, databaseUrl } from "../config/settings.js";

// Force Node.js DNS resolver to use Google & Cloudflare public DNS servers and prioritize IPv4 only in development.
// This bypasses unreliable local/ISP DNS servers that block or fail MongoDB Atlas SRV lookups during local dev.
if (process.env.NODE_ENV !== "production") {
	try {
	  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
	  dns.setDefaultResultOrder("ipv4first");
	} catch (err) {
	  console.warn(
		"Could not set custom DNS configurations, using system default.",
		err
	  );
	}
  }
  
  const connectDB = async () => {
	const maxRetries = 3;
	let attempt = 0;
  
	let baseUrl = databaseUrl || "";
	if (baseUrl.endsWith("/")) {
	  baseUrl = baseUrl.slice(0, -1);
	}
	const connectionUri = `${baseUrl}/${databaseName}`;
	console.log(connectionUri);
  
	while (attempt < maxRetries) {
	  try {
		const connectionInstance = await mongoose.connect(connectionUri);
		console.log(
		  `\n mongoDB Connected !! object:- ${connectionInstance}\n DB HOST: ${connectionInstance.connection.host}`
		);
		return;
	  } catch (error) {
		attempt++;
		console.log(
		  `MONGODB CONNECTION ERROR (Attempt ${attempt}/${maxRetries})`,
		  error
		);
  
		if (attempt < maxRetries) {
		  const delay = Math.pow(2, attempt) * 1000;
		  console.log(`Retrying in ${delay / 1000} seconds...`);
		  await new Promise((resolve) => setTimeout(resolve, delay));
		} else {
		  console.log("\nMax retries reached. Database connection failed.");
		  process.exit(1);
		}
	  }
	}
  };
  export default connectDB;
  