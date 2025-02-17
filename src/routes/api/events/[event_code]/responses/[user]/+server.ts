import { tableFormToDatabaseForm } from '$lib/utils'
import { updateUserAvailabilities } from '../../../../../../db.server.js'

export async function PUT( {params, request}) {
    const newUserResponse = await request.json()

    const availabilityQueue = tableFormToDatabaseForm(newUserResponse.availability, new Date(newUserResponse.firstDate))

    await updateUserAvailabilities(params.event_code, params.user, availabilityQueue)
    
    return new Response("", { status: 201 })
}