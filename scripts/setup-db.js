const { Client } = require("pg");
require("dotenv").config();

async function setupDatabase() {
  // For Neon PostgreSQL, the database is already created and managed
  // This script now just tests the connection
  const connectionString = process.env.DATABASE_URL;

  console.log("Testing connection to Neon PostgreSQL database...");

  try {
    // Create connection to PostgreSQL
    const client = new Client({
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    await client.connect();
    console.log("Connected to Neon PostgreSQL database successfully");

    // Test the connection with a simple query
    const result = await client.query("SELECT NOW() as current_time");
    console.log(
      "Database connection test successful:",
      result.rows[0].current_time
    );

    await client.end();
    console.log("Database setup completed successfully");
    return true;
  } catch (error) {
    console.error("Error setting up database:", error.message);
    return false;
  }
}

setupDatabase()
  .then((success) => {
    if (success) {
      console.log('You can now run "npm run db:push" to create the tables');
    } else {
      console.log("Please check your PostgreSQL connection and try again");
    }
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("Unexpected error:", error);
    process.exit(1);
  });
