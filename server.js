"use strict";

require("dotenv").config({ quiet: true });

const app = require("./src/app");
const { connectDatabase } = require("./src/config/db");

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDatabase();
    console.log("Database connected.");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    console.error("Starting server in offline database mode.");
  }

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

startServer();
