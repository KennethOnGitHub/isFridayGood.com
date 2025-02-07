import { tableFormToDatabaseForm } from '$lib/utils'
import { updateUserAvailabilities } from '../../../../../../db.server.js'

export async function PUT( {params, request}) {
    const response = await request.json()

    const availabilityQueue = tableFormToDatabaseForm(response.availability, new Date(response.firstDate))

    await updateUserAvailabilities(params.event_code, params.user, availabilityQueue)
    
    return new Response("", { status: 201 })
}