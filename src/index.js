"use strict";

require("dotenv").config({ quiet: true });

const app = require("./app");
const { connectDatabase } = require("./config/db");

const port = process.env.PORT || 3000;

if (require.main === module) {
  connectDatabase().catch((error) => {
    console.error("Database connection failed:", error.message);
  });

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

module.exports = app;
