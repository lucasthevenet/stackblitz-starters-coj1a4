import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema-test';

const queryConnection = postgres(process.env.POSTGRES_URL!);

export const db = drizzle(queryConnection, { schema });
