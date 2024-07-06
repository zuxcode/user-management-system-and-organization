const { client } = require("../db");



const organizationTable = `
  CREATE TABLE IF NOT EXISTS Organization (
    orgId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
  );
`;
client.query(organizationTable, (err, res) => {
  if (err) {
    console.error("Error creating organization table", err);
  } else {
    console.log("Organization table created successfully");
  }
  client.end();
});
