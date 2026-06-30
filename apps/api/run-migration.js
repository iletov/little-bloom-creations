const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

require('dotenv').config();
const DATABASE_URL = process.env.DATABASE_URL;
console.log('DATABASE_URL:', DATABASE_URL);
const sql = postgres(DATABASE_URL, { ssl: 'require' });

async function runMigration() {
  try {
    const migrationPath = path.join(__dirname, 'drizzle', 'migrations', '0000_spooky_captain_cross.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf-8');
    
    console.log('Running migration...');
    // Split by statement-breakpoint to execute separately if needed, or run as a single string.
    // postgres.js can run multiple statements at once if passed as a simple string.
    await sql.unsafe(migrationSql.replace(/--> statement-breakpoint/g, ''));
    console.log('Migration successful!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await sql.end();
  }
}

runMigration();
