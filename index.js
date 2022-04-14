const express = require("express");
const cors = require("cors");
const ws = require("ws");
const WebSocket = require("ws");
const wss = new ws.Server(
  {
    port: process.env.PORT || 5000,
  },
  () => console.log("Server started on 5000")
);
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

/* app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Task 4");
});

app.use("/auth", authRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); */
