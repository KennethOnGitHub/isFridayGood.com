import 'dotenv/config';
import postgres from 'postgres';

const connectionString: string = process.env.DATABASE_URL as string;

const sql = postgres(connectionString, { ssl: 'require' });

export { sql };

