const express = require("express");
const cors = require("cors");
const ws = require("ws");
const WebSocket = require("ws");
/* const wss = new ws.Server(
  {
    port: process.env.PORT || 5000,
  },
  () => console.log("Server started on 5000")
); */

const PORT = process.env.PORT || 5000;
const INDEX = "/index.html";

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
const { Server } = require("ws");

const wss = new Server({ server });

let onlinePeople = [];
let wsarray = [];
wss.on("connection", function connection(ws) {
  ws.on("message", function (message) {
    message = JSON.parse(message);
    switch (message.event) {
      case "message":
        console.log(message);
        wss.clients.forEach((client) => {
          client.id === message.recipient &&
            client.send(JSON.stringify(message));
        });
        /* broadCastMessage(message); */
        break;
      case "connection":
        ws.id = message.userName;
        onlinePeople.push(message);
        onlinePeople = [...new Set(onlinePeople.map(JSON.stringify))].map(
          JSON.parse
        );
        broadCastMessage(onlinePeople);
        break;
      case "disactive":
        onlinePeople.splice(
          onlinePeople.findIndex(function (i) {
            return i.id === message.userName;
          }),
          1
        );
        broadCastMessage(onlinePeople);
        break;
    }
  });
  ws.on("close", function () {
    onlinePeople.splice(
      onlinePeople.findIndex(function (i) {
        return i.id === ws.id;
      }),
      1
    );
    broadCastMessage(onlinePeople);
  });
});

function broadCastMessage(message) {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(message));
  });
}
