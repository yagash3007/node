const { log } = require("console");
const express = require("express");
const fs = require("fs");
const path = require("path");
const userApis = express.Router();
const app = express();

app.use(express.json());

const filePath = path.join(__dirname, "user.json");

const readFile = () => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    return [];
  }
};

const writeFile = (data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error(err);
  }
};

// Get all entries
userApis.get("/", (req, res) => {
  const data = readFile();
  res.status(200).json(data);
});

// Post a new entry
userApis.post("/add_user", (req, res) => {
  const body = req.body;
  const users = readFile();
  console.log(users);

  const latestId = users.length
    ? Math.max(...users.map((item) => item.id)) + 1
    : 1;
  const newUser = { id: latestId, content: body };
  users.push(newUser);

  writeFile(users);
  res.status(201).json(newUser);
});

// Get a specific entry
userApis.get("/:user", (req, res) => {
  const ticketID = req.params.user;
  console.log(ticketID);

  const users = readFile();
  const user = users.find((user) => user.id == ticketID);
  console.log(user);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Update an entry
userApis.put("/:id", (req, res) => {
  const ticketID = parseInt(req.params.id);
  const body = req.body;
  let users = readFile();

  const userIndex = users.findIndex((user) => user.id === ticketID);
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users[userIndex].content = body;
  writeFile(users);
  res.status(200).json(users[userIndex]);
});

// Delete an entry
userApis.delete("/:id", (req, res) => {
  const ticketID = parseInt(req.params.id);
  let users = readFile();

  const userIndex = users.findIndex((user) => user.id === ticketID);
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users.splice(userIndex, 1);
  writeFile(users);
  res.status(200).json({ message: "Deleted successfully" });
});

module.exports = userApis;
