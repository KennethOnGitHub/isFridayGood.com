import { json } from "@sveltejs/kit";
import { tableFormToDatabaseForm, addUserToEvent } from "$lib/server/utils.js"
import { sql } from "../../../db.server.js";

function generateEventCode(): string {
    const EVENT_CODE_CHARACTER_SET = "abcdefghijklmnopqrstuvwxyz0123456789"
    const EVENT_CODE_LENGTH = 6

    let eventCode = ""
    for (let i = 0; i < EVENT_CODE_LENGTH; i++) {
        const charIndex = Math.floor(Math.random() * EVENT_CODE_CHARACTER_SET.length)
        eventCode += EVENT_CODE_CHARACTER_SET[charIndex]
    }

    return eventCode
}

export async function POST({ request, cookies}): Promise<Response> {
    
    console.log("begin event creation")
    
    const test = await sql`SELECT Version()`

    const as = test[0]

    console.log(as)



    const event = await request.json()

    const availabilityQueue = tableFormToDatabaseForm(event.availability, new Date(event.firstDate))
    const eventCode = generateEventCode()

    
    addUserToEvent(eventCode, "HOST", availabilityQueue)


    const DATE_FORMAT = "YYYY-MM-YY"
    console.log(event)
    const dateWithoutTime = event.firstDate.substring(0, DATE_FORMAT.length)
    await sql`
    INSERT INTO events(event_code, event_name, first_date)
    VALUES (${ eventCode }, ${ event.title }, ${ dateWithoutTime })
    `

    return json({ eventCode }, {status: 201})
}