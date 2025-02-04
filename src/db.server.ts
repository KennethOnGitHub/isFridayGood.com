import { DATABASE_URL } from '$env/static/private';
import type { Availability } from '$lib/utils';

import 'dotenv/config';
import postgres from 'postgres';

const connectionString: string = process.env.DATABASE_URL as string;
console.log("DB URL:", DATABASE_URL)
console.log("COnnection string:", connectionString)

const sql = postgres(connectionString, { ssl: 'require' });

export { sql };
export async function checkEventExists(eventCode: string): Promise<boolean> {
    const presenceCheckQuery = await sql`
    SELECT EXISTS (
    SELECT 1
    FROM users
    WHERE event_code = ${eventCode}
    );`

    const { exists } = presenceCheckQuery[0]
    return exists
}

export async function addUserToEvent(eventCode: string, userName: string, availabilities: Availability[]) {
    console.log("adding following user to DB:", eventCode, userName, availabilities)
    const presenceCheckQuery = await sql`
    SELECT EXISTS (
        SELECT 1
        FROM users
        WHERE event_code = ${eventCode} AND user_name = ${userName}
        );`

    console.log("conducted presence check!")
    const { exists } = presenceCheckQuery[0]
    if (exists) {
        throw Error("User with that name already Exists!")
    }

    console.log("Presence Check Success!")

    const userCountQuery = await sql`
    SELECT COUNT(*)
    FROM users
    WHERE event_code = ${eventCode}`
    const thisUserID = parseInt(userCountQuery[0].count)
    console.log("UserID Generated")

    await sql`
    INSERT INTO users(event_code, user_id, user_name)
    VALUES( ${eventCode}, ${thisUserID}, ${userName})`
    console.log("ADDED USER!")

    //Transforms them into a form that is accepted by sql and inserts into DB
    const availabilityRecords = availabilities.map((x) => ({
        event_code: eventCode,
        user_id: thisUserID,
        start_time: x.start,
        end_time: x.end,
    }))

    await sql`
    INSERT INTO availabilities ${sql(availabilityRecords, 'event_code', 'user_id', 'start_time', 'end_time')}`
    console.log("ADDED USER'S AVAILABILITIES!!")
}

export async function bookTime(eventcode: string, bookedTime: Date) {
    await sql`UPDATE events
    SET selected_time = ${bookedTime}
    WHERE event_code = ${eventcode}`
}