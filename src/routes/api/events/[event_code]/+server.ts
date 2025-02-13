import { sql, updateUserAvailabilities } from "../../../../db.server";
import { checkEventExists } from "../../../../db.server";
import { tableFormToDatabaseForm, type Availability, type UserData, type WholeEvent } from "$lib/utils";
import { json } from "@sveltejs/kit";

export async function GET( { params }) {
    if (await checkEventExists(params.event_code) === false) { //Validate that event exists
        throw Error("Event with code does not exist!")
    }

    const eventQuery = await sql`SELECT *
    FROM events
    WHERE event_code = ${params.event_code}`

    const usersQuery = await sql`SELECT user_name
    FROM users
    WHERE event_code = ${params.event_code}
    ORDER BY user_id`

    const userAvailabilitiesQuery = await sql`SELECT user_id, start_time, end_time
    FROM availabilities
    WHERE event_code = ${params.event_code}
    `

    const numberOfUsers = usersQuery.length
    // const userDatas: UserData[] = new Array<UserData>(numberOfUsers)

    // userDatas = userDatas.map(data => {} )

    //Initialising userDatas
    const userDatas: UserData[] = []
    for (let i = 0; i < numberOfUsers; i++) {
        userDatas.push({username: usersQuery[i].user_name, availabilities: []})
    }

    //Sorts each user's availability into the right array
    userAvailabilitiesQuery.forEach(availability  => {
        console.log(availability.user_id)
        userDatas[availability.user_id].availabilities.push( {start: availability.start_time, end: availability.end_time})
        console.log("type: " + typeof availability.start_time )
        console.log(availability.start_time.getTime())
    })

    const returnedResponse: WholeEvent = {
        eventData: {code: eventQuery[0].event_code, //Cleaning up the syntax to make it more JS-like and readable
            name: eventQuery[0].event_name,
            firstDate: eventQuery[0].first_date,
            selectedTime: eventQuery[0].selected_time,
        },
        userDatas: userDatas,
    }

    return json(returnedResponse, {status: 200})
}

export async function PUT( {request, params} ) {
    if (await checkEventExists(params.event_code) === false) { //Validate that event exists
        throw Error("Event with code does not exist!")
    }

    const newEventData = await request.json()

    await sql`UPDATE events
    SET event_name = ${newEventData.title}
    WHERE event_code = ${params.event_code}`

    const availabilitiesQueue: Availability[] = tableFormToDatabaseForm(newEventData.availabilities, newEventData.firstDate)
    await updateUserAvailabilities(params.event_code, "HOST", availabilitiesQueue)

    return new Response("", {status: 201})
}