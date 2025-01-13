import { json } from "@sveltejs/kit";
import { tableFormToDatabaseForm } from "$lib/server/utils.js"

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
    
    const event = await request.json()

    const availabilityQueue = tableFormToDatabaseForm(event.availability, new Date(event.firstDate))
    const eventCode = generateEventCode()

    const sqlCreateQuery = `
    INSERT INTO events (event_code, event_name, first_date)
    VALUES (${eventCode}, ${event.eventTitle}, ${event.firstDate})`

    return json({ eventCode }, {status: 201})
}