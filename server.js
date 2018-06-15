const bodyParser = require("body-parser");
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

let sectionSchema = mongoose.Schema({
  enabled: {type: Boolean, required: true, default: true}
});
let Section = mongoose.model("Section", sectionSchema);

let localizedNameSchema = mongoose.Schema({
  objectID: {type: String, required: true},
  language: {type: String, required: true, default: "en"},
  name: {type: String, required: true, default: ""}
});
let LocalizedName = mongoose.model("LocalizedName", localizedNameSchema);

app.use(bodyParser.json());

function standardEndpoint(closure) {
  return async function(req, res, next) {
    try {
      return await closure(req, res, next);
    } catch (e) {
      console.log(e);
      if (!res.headersSent) {
        res.status(500).json({ok: false, error: "internal_server_error"});
      }
    }
  };
}

function serverEndpoint(closure) {
  return standardEndpoint(async function (req, res, next) {
    if (req.get("Authorization") && await Password.findOne({password: req.get("Authorization")})) {
      return await closure(req, res, next);
    } else {
      res.status(401).json({ok: false, error: "unauthorized"});
    }
  });
}

app.get("/api/v1/server", serverEndpoint((req, res) => {
  res.status(200).json({ok: true});
}));

app.get("/api/v1/menu/sections", standardEndpoint(async (req, res) => {
  let language = req.query.language || "en";
  let sections = await Section.find({}).lean();
  await Promise.all(sections.map(async (section) => {
    let name = await LocalizedName.findOne({objectID: section._id, language: req.query.language});
    section.name = name && name.name;
  }));
  res.json({ok: true, sections: sections});
}));

app.post("/api/v1/menu/sections", serverEndpoint(async (req, res) => {
  let section = new Section({enabled: req.body.enabled == null || req.body.enabled});
  await section.save();
  res.json({ok: true, id: section._id});
}));

app.get("/api/v1/menu/sections/:section", standardEndpoint(async (req, res) => {
  let language = req.query.language || "en";
  let section = await Section.findById(req.params.section).lean();
  if (!section) {
    return res.status(404).json({error: "not_found"});
  }
  let name = await LocalizedName.findOne({objectID: section._id, language: language});
  section.name = name && name.name;
  res.json({ok: true, section: section});
}));

app.put("/api/v1/menu/sections/:section/enabled", serverEndpoint(async (req, res) => {
  let section = await Section.findById(req.params.section);
  if (!section) {
    return res.status(404).json({error: "not_found"});
  }

  section.enabled = !!req.body.enabled;
  await section.save();
  res.json({ok: true});
}));

app.put("/api/v1/menu/sections/:section/:lang", serverEndpoint(async (req, res) => {
  let section = await Section.count({_id: req.params.section});
  if (section !== 1) {
    return res.status(404).json({error: "not_found"});
  }

  let language = await LocalizedName.findOne({objectID: req.params.section, language: req.params.lang});
  if (!language) {
    language = new LocalizedName({objectID: req.params.section, language: req.params.lang});
  }
  language.name = req.body.name;
  await language.save();
  res.json({ok: true});
}));

app.delete("/api/v1/menu/sections/:section", serverEndpoint(async (req, res) => {
  let section = await Section.findById(req.params.section);
  if (!section) {
    return res.status(404).json({error: "not_found"});
  }
  await section.remove();
  await LocalizedName.remove({objectID: section._id});
  res.json({ok: true});
}));

app.use(express.static(__dirname + "/dist/kitchen-order-system"));
app.use("/assets/i18n", express.static(__dirname + "/i18n"));

app.get("/*", (req, res) => {
  res.sendFile(__dirname + "/dist/kitchen-order-system/index.html");
});

app.listen(config.port);
