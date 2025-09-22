import { Pool } from 'pg';

const connectionPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  // Force IPv4 and add connection options
  options: '--client-encoding=UTF8',
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 30000,
  max: 10
});

export default connectionPool;