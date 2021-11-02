const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const port = 3001;
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/", routes);

app.listen(port, () => {
  console.log(`app running on ${port}`);
});

module.exports = app;
