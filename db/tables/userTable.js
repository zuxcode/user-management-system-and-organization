const { client } = require("../db");

// Enable the pgcrypto extension (only needs to be done once per database)

const pgcrypto = `CREATE EXTENSION IF NOT EXISTS pgcrypto;`;

client.query(pgcrypto, (err, res) => {
  if (err) {
    console.error("Error enabling pgcrypto extension", err);
  } else {
    console.log("pgcrypto extension enabled successfully");
  }
});

const userTable = `
  CREATE TABLE IF NOT EXISTS User (
    userId UUID PRIMARY KEY DEFAULT gen_random_uuid(),,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone VARCHAR(255) 
  );
`;
client.query(userTable, (err, res) => {
  if (err) {
    console.error("Error creating user table", err);
  } else {
    console.log("User table created successfully");
  }
  client.end();
});