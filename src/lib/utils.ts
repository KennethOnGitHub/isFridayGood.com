export interface Availability {
    start: Date,
    end: Date,
}

export interface UserData {
    username: string,
    availabilities: Availability[]
}

export interface EventData {
    code: string,
    name: string,
    firstDate: Date,
    selectedTime?: Date,
}

export interface WholeEvent {
    eventData: EventData
    userDatas: UserData[]
}

export interface EventViewModel {
    eventData: EventData
    availabilities: Map<string, boolean[][]>
}

export const MILLISECONDS_IN_SECOND = 1000
export const SECONDS_PER_MINUTE = 60
const MINUTES_PER_TIME_SLOT = 30
export const MILLISECONDS_PER_TIME_SLOT = MINUTES_PER_TIME_SLOT * SECONDS_PER_MINUTE * MILLISECONDS_IN_SECOND
export const TIME_SLOTS_PER_DAY = 24 * 60 / MINUTES_PER_TIME_SLOT

export async function loadEvent(event_code: string): Promise<EventViewModel> {
    const request = await fetch(`/api/events/${event_code}`)
    const wholeEvent = await request.json() as WholeEvent

    //converts from string to Date Object
    wholeEvent.userDatas.forEach(userData => {
        userData.availabilities = userData.availabilities.map(availability => ({start: new Date(availability.start), end: new Date(availability.end)})) 
    } )
    wholeEvent.eventData.firstDate = new Date(wholeEvent.eventData.firstDate)
    wholeEvent.eventData.firstDate.setHours(0, 0, 0, 0) //Sets time to midnight

    console.log(wholeEvent.eventData.selectedTime)
    if (wholeEvent.eventData.selectedTime) {
        wholeEvent.eventData.selectedTime = new Date(wholeEvent.eventData.selectedTime)
    }
    
    const availabilitiesTables = new Map<string, boolean[][]>()
    wholeEvent.userDatas.forEach(userData => {
        //Convert to 2D array as that is what the code ahead expects
        const timetable:boolean[][] = databaseFormToTableForm(userData.availabilities, wholeEvent.eventData.firstDate)
        availabilitiesTables.set(userData.username, timetable)
    })

    //Transform to fit the data structure expected by front end
    const viewModel = {
        eventData: wholeEvent.eventData,
        availabilities: availabilitiesTables
    }

    return viewModel
}

export function dateTimeToArrayCoordinates(targetDate: Date, firstDateOfArray: Date): {column: number, row: number} {

    const firstDateIsMidnight = (firstDateOfArray.getHours() == 0 
    && firstDateOfArray.getMinutes() == 0 
    && firstDateOfArray.getSeconds() == 0 
    && firstDateOfArray.getMilliseconds() == 0)
    
    if ( !firstDateIsMidnight) {
        throw Error("Invalid First Date: firstDateOfArray's time must be midnight!")
    }

    const timeDifferenceInMs = targetDate.getTime() - firstDateOfArray.getTime()
    if (timeDifferenceInMs < 0) {
        throw Error("Invalid Date(s): Date to be transformed to Array Coordinates is before the first date of the array!")
    }
    
    const timeSlotDifference = timeDifferenceInMs / MILLISECONDS_PER_TIME_SLOT
    const column = Math.floor(timeSlotDifference / TIME_SLOTS_PER_DAY)
    const row = timeSlotDifference % TIME_SLOTS_PER_DAY
    
    return {column, row}
}

export function databaseFormToTableForm(availabilities: Availability[], firstServerDate: Date): boolean[][] {

    const timetable:boolean[][] = []

    console.log("converting following to timetable:", availabilities)

    availabilities.forEach(availability => {
        const start = dateTimeToArrayCoordinates(availability.start, firstServerDate)
        const end = dateTimeToArrayCoordinates(availability.end, firstServerDate)
        
        //Expand timetable to fit this availability
        while (end.column >= timetable.length) {
            timetable.push(new Array<boolean>(TIME_SLOTS_PER_DAY).fill(false))
        }

        //Sets all the time between start (inclusive) and end (exclusive) to true
        let column = start.column
        let row = start.row
        while (column < end.column || row < end.row ) {

            console.log("setting col, row, to true: ", column, row)
            timetable[column][row] = true

            row++
            if (row >= TIME_SLOTS_PER_DAY) {
                column++
                row = 0
            }
        }
    });

    return timetable
}

export function tableFormToDatabaseForm(timeTable: boolean[][], initialDateTime: Date): Availability[] {
    console.log(`converting table to DB... firstdate: ${initialDateTime}`)

    timeTable.forEach(
        column => 
            {if (column.length != TIME_SLOTS_PER_DAY) {
                throw new Error("Could not convert timetable to database form. A column in the timetable is not the correct size!")
            }})

    const timeStream = timeTable.flat()
    let i = 0

    const availabilities: Availability[] = []

    while (i < timeStream.length) {

        if (timeStream[i] == true) {
            const startTime = new Date(initialDateTime.getTime() + i * MILLISECONDS_PER_TIME_SLOT)

            while (i < timeStream.length && timeStream[i] == true) {
                i++
            }
            const endTime = new Date(initialDateTime.getTime() + i * MILLISECONDS_PER_TIME_SLOT)
            availabilities.push({ start: startTime, end: endTime })
        }

        i++
    }
    return availabilities
}
