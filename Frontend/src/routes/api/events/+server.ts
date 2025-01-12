import { json } from "@sveltejs/kit";
import { tableFormToDatabaseForm } from "$lib/server/utils.js"

export async function POST({ request, cookies}): Promise<Response> {
    
    const event = await request.json()

    const availabilityQueue = tableFormToDatabaseForm(event.availability, new Date(event.firstDate))

    console.log(availabilityQueue)

    const eventCode = "test123"

    return json({ eventCode }, {status: 201})
}