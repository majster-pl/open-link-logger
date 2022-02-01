const express = require("express");
const path = require("path");
const argv = require("minimist")(process.argv.slice(2));

const app = express();

const port = argv.p || 3900;

app.use(express.static(path.join(__dirname, "..", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.listen(port);
