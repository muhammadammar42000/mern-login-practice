const express = require("express");
require("./db/connection");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = process.env.PORT || 8000;
const Register = require("./models/registers");

// const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

//create a new user in our database
app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmPassword;

    if (password === cpassword) {
      const registerEmployee = new Register({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        age: req.body.age,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
      });

      const token = await registerEmployee.generateAuthToken();

      const registered = await registerEmployee.save();

      res.status(201).render("index");
    } else {
      res.status(400).send("password not matched");
    }
  } catch (error) {
    res.status(400).send();
  }
});

//login API
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await Register.findOne({ email: email });

    const isMatched = await bcrypt.compare(password, user.password);

    const token = await user.generateAuthToken();

    if (isMatched) {
      res.status(201).render("index");
    } else {
      res.send("Invalid login details");
    }
  } catch (error) {
    res.status(404).send("Invalid login details");
  }
});

app.listen(PORT, () => {
  console.log(`Connection Successfull on PORT no. ${PORT}`);
});
