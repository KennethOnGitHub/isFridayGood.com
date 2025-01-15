import { DATABASE_URL } from '$env/static/private';
import 'dotenv/config';
import postgres from 'postgres';

const connectionString: string = process.env.DATABASE_URL as string;
console.log("DB URL:", DATABASE_URL)
console.log("COnnection string:", connectionString)

const sql = postgres(connectionString, { ssl: 'require' });

export { sql };

