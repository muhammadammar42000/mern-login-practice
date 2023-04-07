const mongoose = require("mongoose");

const url = "mongodb://127.0.0.1:27017/registration";
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connection successfull ..."))
  .catch((err) => console.log("no connection"));
