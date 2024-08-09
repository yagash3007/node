const express = require("express");
const teamApis = require("./api/tickets/teams");
const userApis = require("./api/tickets/user");
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Route handlers
app.use("/teams", teamApis);
app.use("/user", userApis);
// Start the server
app.listen(3000, (error) => {
  if (error) {
    console.error("Server start failed:", error);
  } else {
    console.log("Server started on port 3000");
  }
});
