const express = require("express");
const path = require("path");
const argv = require("minimist")(process.argv.slice(2));

const app = express();

const port = argv.p || 3900;
const data_path = argv.d || path.join(__dirname, "..", "data/", "db.json");
console.dir(port);
console.dir(data_path);

app.use(express.static(path.join(__dirname, "..", "build")));

app.get("/", (req, res) => {
  //   res.sendFile("./views/index.html", { root: __dirname });
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.listen(port);
