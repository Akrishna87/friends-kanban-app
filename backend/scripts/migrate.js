require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const createTables = async () => {
  try {
    console.log('Starting database migration...');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        google_id VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        profile_picture TEXT,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Users table created');

    // Create boards table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS boards (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Boards table created');

    // Create columns table  
    await pool.query(`
      CREATE TABLE IF NOT EXISTS columns (
        id SERIAL PRIMARY KEY,
        board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        position INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Columns table created');

    // Create tasks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        column_id INTEGER REFERENCES columns(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        assigned_to INTEGER REFERENCES users(id),
        position INTEGER NOT NULL,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Tasks table created');

    // Create indexes for better performance
    await pool.query('CREATE INDEX IF NOT EXISTS idx_boards_created_by ON boards(created_by);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_columns_board_id ON columns(board_id);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_tasks_column_id ON tasks(column_id);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);');
    console.log('✓ Indexes created');

    console.log('\n✅ Database migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
};

create Tables();
