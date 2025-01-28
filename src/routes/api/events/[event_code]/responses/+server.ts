import { addUserToEvent } from "../../../../../db.server";
import { tableFormToDatabaseForm } from "$lib/utils";

export async function POST({ request, params }): Promise<Response> { 
    const response = await request.json()

    const availabilityQueue = tableFormToDatabaseForm(response.availability, new Date(response.firstDate))
    addUserToEvent(params.event_code, response.username, availabilityQueue)

    console.log("user added to event")
    return new Response("", { status: 201 })
}