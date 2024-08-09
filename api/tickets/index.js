const express = require("express");
const ticketApis = express.Router();

ticketApis.get("/", (req, res) => {
  res.status(200).json({ message: "helloooo" });
});

ticketApis.post("/", (req, res) => {
  const body = req.body;

  fs.appendFileSync("./api/tickets/sample.txt", `${JSON.stringify(body)}\n`, {
    encoding: "utf8",
  });

  res.status(201).json({ ...body });
});

ticketApis.put("/:ticketId", (req, res) => {
  const ticketId = req.params.ticketId;

  res.status(201).json({ ...ticketId });
});

ticketApis.delete("/:ticketId", (req, res) => {
  const ticketId = req.params.ticketId;

  res.status(201).json({ ...ticketId });
});

module.exports = ticketApis;
