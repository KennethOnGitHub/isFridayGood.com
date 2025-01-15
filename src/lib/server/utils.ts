import { sql } from "../../db.server"

export interface availability {
    start: Date,
    end: Date,
}

export function tableFormToDatabaseForm(timeTable: boolean[][], initialDateTime: Date):availability[]  {
    console.log(`firstdate: ${initialDateTime}`)

    const MILLISECONDS_IN_SECOND = 1000
    const SECONDS_PER_MINUTE = 60
    const MILLISECONDS_PER_TIME_SLOT = 30 * SECONDS_PER_MINUTE * MILLISECONDS_IN_SECOND

    const timeStream = timeTable.flat()
    let i = 0;

    const availabilities:availability[] = []

    while (i < timeStream.length) {

        if (timeStream[i] == true) {
            const startTime = new Date(initialDateTime.getTime() + i*MILLISECONDS_PER_TIME_SLOT)

            while (i < timeStream.length && timeStream[i] == true) {
                i++
            }
            const endTime = new Date(initialDateTime.getTime() + i*MILLISECONDS_PER_TIME_SLOT)
            availabilities.push({start: startTime, end: endTime})
        } 

        i++
    } 
    return availabilities
}

export async function addUserToEvent(eventCode: string, userName: string, availabilities: availability[]) {
    const presenceCheckQuery = await sql`
    SELECT EXISTS (
        SELECT 1
        FROM users
        WHERE event_code = ${ eventCode } AND user_name = ${ userName }
        );`

    const { exists } = presenceCheckQuery[0]
    if (exists) {
        throw Error("User with that name already Exists!")
    }

    console.log("Presence Check Success!")

    const userCountQuery = await sql`
    SELECT COUNT(*)
    FROM users
    WHERE event_code = ${ eventCode }`
    const thisUserID = parseInt(userCountQuery[0].count)
    console.log("UserID Generated")

    await sql`
    INSERT INTO users(event_code, user_id, user_name)
    VALUES( ${ eventCode }, ${ thisUserID }, ${ userName })`
    console.log("ADDED USER!")

    //Transforms them into a form that is accepted by sql and inserts into DB
    const availabilityRecords = availabilities.map((x) => ({
        event_code: eventCode,
        user_id: thisUserID,
        start_time: x.start,
        end_time: x.end,
    }) )

    await sql`
    INSERT INTO availabilities ${ sql(availabilityRecords, 'event_code', 'user_id', 'start_time', 'end_time')}
    `
    console.log("ADDED USER'S AVAILABILITIES!!")
}
