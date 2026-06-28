import "./config/env.js";
import connectDB from "./db/connectionDB.js";
import { app } from "./app.js";
import { PORT } from "./config/settings.js";

connectDB()
  .then(() => {
    app.listen(PORT || 8080, () =>
      console.log(`Server is running at port: ${PORT || 8080}`)
    );
  })
  .catch((error) =>
    console.log("MONGODB CONNECTION ERROR in index.js:", error)
  );
