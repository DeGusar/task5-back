const express = require("express");
const cors = require("cors");
const ws = require("ws");
const WebSocket = require("ws");

const PORT = process.env.PORT || 3010;
const INDEX = "/index.html";

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
const { Server } = require("ws");
const { connect } = require("getstream");

const wss = new Server({ server });

wss.on("connection", function connection(ws) {
  ws.on("message", function (message) {
    message = JSON.parse(message);
    switch (message.event) {
      case "message":
        wss.clients.forEach((client) => {
          client.send(JSON.stringify(message));
        });
        break;
      case "connection":
        ws.id = message.idItem;
        break;
    }
  });
});
