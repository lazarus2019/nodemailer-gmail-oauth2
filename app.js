require("dotenv").config();
const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");
const sendMailRoute = require("./routes/mail");

const app = express();

const { PORT } = process.env;

// View engine setup
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

// Static folder
app.use("/public", express.static(path.join(__dirname, "public")));

// parse application/json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("contact");
});

app.use("/", sendMailRoute);

const _PORT = PORT || 5000;

app.listen(_PORT, () => console.log(`Server start at port ${_PORT}`));
