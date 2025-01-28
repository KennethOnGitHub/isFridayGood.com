import { addUserToEvent } from "../../../../../db.server";
import { tableFormToDatabaseForm } from "$lib/utils";

export async function POST({ request, params }): Promise<Response> { 
    const response = await request.json()

    
    const availabilityQueue = tableFormToDatabaseForm(response.availability, new Date(response.firstDate))
    addUserToEvent(params.event_code, response.username, availabilityQueue)

    return new Response("", { status: 201 })
}