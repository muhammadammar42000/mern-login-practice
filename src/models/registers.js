const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    require: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

//generating Tokens
employeeSchema.methods.generateAuthToken = async function (req, res) {
  try {
    const token = jwt.sign(
      { _id: this._id.toString() },
      "mynameismuhammadammarandthisismysecretkey"
    );
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
  } catch (error) {
    res.send(error);
  }
};

//middle ware --> we convert password into hash value
employeeSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    console.log(this.password);
    this.confirmPassword = undefined;
  }
  next();
});

//Now we need to create collection
const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;
