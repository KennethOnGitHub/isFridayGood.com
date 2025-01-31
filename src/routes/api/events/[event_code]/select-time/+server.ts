import { bookTime } from '../../../../../db.server.js'

export async function PUT( { request, params }) {
    const response = await request.json()

    bookTime(params.event_code, response.bookedTime)

    return new Response("", { status: 201 })
}