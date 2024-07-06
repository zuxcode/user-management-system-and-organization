const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { client } = require("../db/db");
const { registerSchemaValidator } = require("../utils/validator");

exports.register = async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body;

  try {
    // Check if email already exists
    const emailCheck = await client.query(
      `SELECT email FROM User WHERE email = $1`,
      [email]
    );

    // Check if email already exists
    if (emailCheck.rowCount > 0) {
      // Email already exists
      return res.send({
        field: "email",
        message: "Email already exists",
        statusCode: 422,
      });
    }

    //   VALIDATE SCHEMA
    const { error } = await registerSchemaValidator.validateAsync(req.body);
    if (error) {
      return res.send({
        field: error.details[0].message.replace(/['"]+/g, ""),
        message: error.details[0].message,
        statusCode: 422,
      });
    }
      
    //   HASH PASSWORD
    const genSalt = bcrypt.getSalt("SuperHash");
    const hashedPassword = await bcrypt.hash(password, genSalt);

    const userRes = await client.query(
      `
            INSERT INTO User (firstName, lastName, email, password, phone)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
      `,
      [firstName, lastName, email, hashedPassword, phone]
    );

    const payload = { id: userRes.id, email: userRes.email };

    jwt.sign(payload, "secret", { expiresIn: "1h" }, (err, token) => {
      res.json({
        success: true,
        token,
      });
    });

    res.status(201).json(userRes.rows[0]);
  } catch (err) {
    console.error(err);
    res.send({
      status: "Bad Request",
      message: "Registration unsuccessful",
      statusCode: 400,
    });
  }
};

// exports.login = (req, res) => {
//   const { email, password } = req.body;

//   User.findOne({ email })
//     .then((user) => {
//       if (!user) {
//         return res.status(401).json({ message: "User not found" });
//       }
//       return bcrypt.compare(password, user.password);
//     })
//     .then((isMatch) => {
//       if (!isMatch) {
//         return res.status(401).json({ message: "Invalid Credentials" });
//       }
//       const payload = { id: user.id, email: user.email };
//       jwt.sign(payload, "secret", { expiresIn: "1h" }, (err, token) => {
//         res.json({
//           success: true,
//           token,
//         });
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({ message: "Server Error" });
//     });
// };
