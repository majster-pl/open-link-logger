const express = require("express");
const argv = require("minimist")(process.argv.slice(2));

const app = express();

const port = argv.p || 3900;
const data_path = argv.d || __dirname + "/data.json";
console.dir(port);
console.dir(data_path);

app.listen(port);

app.get("/", (req, res) => {
  res.sendFile("./views/index.html", { root: __dirname });
});

app.get("/data", (req, res) => {
  res.sendFile(data_path);
});

app.get("/css/main.min.css", (req, res) => {
  res.sendFile("./css/main.min.css", { root: __dirname });
});

app.get("/img/favicon-512.png", (req, res) => {
  res.sendFile("./img/favicon-512.png", { root: __dirname });
});

app.get("/img/logo-with-title.png", (req, res) => {
  res.sendFile("./img/logo-with-title.png", { root: __dirname });
});

app.use((req, res) => {
  res.sendFile("./views/404.html", { root: __dirname });
});
