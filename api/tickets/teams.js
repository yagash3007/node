const express = require("express");
const fs = require("fs");
const teamApis = express.Router();
const app = express();

app.use(express.json());

const readFile = () => {
  try {
    const data = fs.readFileSync("./api/tickets/tickets.json", "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    return [];
  }
};

const writeFile = (data) => {
  try {
    fs.writeFileSync(
      "./api/tickets/tickets.json",
      JSON.stringify(data, null, 2),
      "utf8"
    );
  } catch (err) {
    console.error(err);
  }
};

// Validate mobile number
const isValidMobileNumber = (phoneno) => {
  const regex = /^\d{10}$/;
  return regex.test(phoneno);
};

// Get
teamApis.get("/", (req, res) => {
  const data = readFile();
  res.status(200).json(data);
});

// POST
teamApis.post("/create_team", (req, res) => {
  const body = req.body;
  const tickets = readFile();

  // Validate mobile number
  if (!isValidMobileNumber(body.phoneno)) {
    return res.status(400).json({ message: "Invalid mobile number" });
  }

  // Validation for duplicate entries
  const isDuplicate = tickets.some(
    (ticket) =>
      ticket.content.emailId === body.emailId ||
      ticket.content.phoneno === body.phoneno ||
      (ticket.content.firstname === body.firstname &&
        ticket.content.lastname === body.lastname)
  );

  if (isDuplicate) {
    return res.status(400).json({ message: "Found a duplicate" });
  }

  const latestId = tickets.length
    ? Math.max(...tickets.map((item) => item.id)) + 1
    : 1;
  const newTicket = { id: latestId, content: body };
  tickets.push(newTicket);

  writeFile(tickets);
  res.status(201).json(newTicket);
});

// Get a specific team
teamApis.get("/:teamID", (req, res) => {
  const teamID = req.params.teamID;
  const teams = readFile();
  const team = teams.find((team) => team.id == teamID);

  if (team) {
    res.status(200).json(team);
  } else {
    res.status(404).json({ message: "No Items Found" });
  }
});

// Update a ticket
teamApis.put("/:teamID", (req, res) => {
  const ticketID = parseInt(req.params.teamID);
  const body = req.body;
  let tickets = readFile();

  // Validate mobile number
  if (!isValidMobileNumber(body.phoneno)) {
    return res.status(400).json({ message: "Invalid mobile number" });
  }

  const ticketIndex = tickets.findIndex((ticket) => ticket.id === ticketID);
  if (ticketIndex === -1) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  // Validation for duplicate entries
  const isDuplicate = tickets.some(
    (ticket) =>
      ticket.id !== ticketID &&
      (ticket.content.emailId === body.emailId ||
        ticket.content.phoneno === body.phoneno ||
        (ticket.content.firstname === body.firstname &&
          ticket.content.lastname === body.lastname))
  );

  if (isDuplicate) {
    return res.status(400).json({ message: "Duplicate found" });
  }

  tickets[ticketIndex].content = body;
  writeFile(tickets);
  res.status(200).json(tickets[ticketIndex]);
});

// Delete a ticket
teamApis.delete("/:ticketID", (req, res) => {
  const ticketID = parseInt(req.params.ticketID);
  let tickets = readFile();

  const ticketIndex = tickets.findIndex((ticket) => ticket.id === ticketID);
  if (ticketIndex === -1) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  tickets.splice(ticketIndex, 1);
  writeFile(tickets);
  res.status(200).json({ message: "Ticket deleted successfully" });
});

module.exports = teamApis;
