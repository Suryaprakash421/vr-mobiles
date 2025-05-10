const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  // Extract database name from the connection string
  const connectionString = process.env.DATABASE_URL;
  const dbNameMatch = connectionString.match(/\/([^?]*)/);
  const dbName = dbNameMatch ? dbNameMatch[1] : 'vr_mobiles';
  
  // Extract credentials from the connection string
  const userMatch = connectionString.match(/mysql:\/\/([^:]*):([^@]*)@/);
  const user = userMatch ? userMatch[1] : 'root';
  const password = userMatch ? userMatch[2] : 'password';
  
  // Extract host from the connection string
  const hostMatch = connectionString.match(/@([^:]*):(\d+)\//);
  const host = hostMatch ? hostMatch[1] : 'localhost';
  const port = hostMatch ? parseInt(hostMatch[2]) : 3306;
  
  console.log(`Attempting to connect to MySQL at ${host}:${port} as ${user}`);
  
  try {
    // Create connection without database name
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
    });
    
    console.log('Connected to MySQL server');
    
    // Check if database exists
    const [rows] = await connection.execute(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
      [dbName]
    );
    
    if (rows.length === 0) {
      console.log(`Database '${dbName}' does not exist. Creating it...`);
      await connection.execute(`CREATE DATABASE ${dbName}`);
      console.log(`Database '${dbName}' created successfully`);
    } else {
      console.log(`Database '${dbName}' already exists`);
    }
    
    await connection.end();
    console.log('Database setup completed successfully');
    return true;
  } catch (error) {
    console.error('Error setting up database:', error.message);
    return false;
  }
}

setupDatabase()
  .then((success) => {
    if (success) {
      console.log('You can now run "npm run db:push" to create the tables');
    } else {
      console.log('Please check your MySQL connection and try again');
    }
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
