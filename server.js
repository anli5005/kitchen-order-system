const express = require("express");
const path = require("path");
let mongoose = require("mongoose");
let app = express();

const config = require("./config.json");
mongoose.connect(config.mongo);

let passwordSchema = mongoose.Schema({
  password: {type: String, required: true, min: 8}
});
let Password = mongoose.model("Password", passwordSchema);

function serverEndpoint(closure) {
  return async function(req, res, next) {
    try {
      if (req.get("Authorization") && await Password.findOne({password: req.get("Authorization")})) {
        return await closure(req, res, next);
      } else {
        res.status(401).json({ok: false, error: "unauthorized"});
      }
    } catch (e) {
      console.log(e);
      if (!res.headersSent) {
        res.status(500).json({ok: false, error: "internal_server_error"});
      }
    }
  };
}

app.get("/api/v1/server", serverEndpoint((req, res) => {
  res.status(200).json({ok: true});
}));

app.use(express.static(__dirname + "/dist/kitchen-order-system"));
app.use("/assets/i18n", express.static(__dirname + "/i18n"));

app.get("/*", (req, res) => {
  res.sendFile(__dirname + "/dist/kitchen-order-system/index.html");
});

app.listen(config.port);
