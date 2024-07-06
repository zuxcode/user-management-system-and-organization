const { Client } = require("pg");

const client = new Client({
  user: "",
  password: "password",
  host: "localhost",
  port: "5432",
  database: "",
});

client
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL database", err);
  });

  exports.client = client;