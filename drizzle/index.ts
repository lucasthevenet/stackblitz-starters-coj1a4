import { createPool } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema-test';

const dbClient = createPool({
  connectionString: process.env.POSTGRES_URL,
});

export const db = drizzle(dbClient, { schema });


db.query.address.