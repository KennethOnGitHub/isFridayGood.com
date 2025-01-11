interface availability {
    start: Date,
    end: Date,
}

function TableFormToDatabaseForm(timeTable: boolean[][], firstDate: Date):availability[]  {
    const MILLISECONDS_IN_SECOND = 1000
    const SECONDS_PER_MINUTE = 60
    const MILLISECONDS_PER_TIME_SLOT = 30 * SECONDS_PER_MINUTE * MILLISECONDS_IN_SECOND

    const timeStream = timeTable.flat()
    let i = 0;

    const availabilities:availability[] = []

    while (i < timeStream.length) {

        if (timeStream[i] == true) {
            const startTime = new Date(firstDate.getTime() + i*MILLISECONDS_PER_TIME_SLOT)

            while (i < timeStream.length && timeStream[i] == true) {
                i++
            }
            const endTime = new Date(firstDate.getTime() + i*MILLISECONDS_PER_TIME_SLOT)
            availabilities.push({start: startTime, end: endTime})
        } 

        i++
    } 
    return availabilities
}

