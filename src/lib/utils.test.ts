import { expect, test} from 'vitest'
import { databaseFormToTableForm, dateTimeToArrayCoordinates, tableFormToDatabaseForm, type Availability } from './utils'

test("tableFormToDatabaseForm_Empty_Empty", () =>{

    const inputTable:boolean[][] = []
    const firstDate = new Date(0)
    
    const expected:Availability[] = []

    expect(tableFormToDatabaseForm(inputTable, firstDate)).toEqual(expected)
})

test("tableFormToDatabaseForm_AllFalse_Empty", () =>{

    const inputTable:boolean[][] = [new Array<boolean>(48).fill(false)]
    const firstDate = new Date(0)
    
    const expected:Availability[] = []

    expect(tableFormToDatabaseForm(inputTable, firstDate)).toEqual(expected)
})

test("tableFormToDatabaseForm_ThreeConsecutiveTrue_OneAvailability", () =>{

    const inputTable:boolean[][] = [new Array<boolean>(48).fill(false)]

    inputTable[0].fill(true, 0, 3)

    const firstDate = new Date("1970-01-01T00:00:00")
    
    const expected:Availability[] = [ {start: new Date("1970-01-01T00:00:00"), end: new Date("1970-01-01T01:30:00")}]

    expect(tableFormToDatabaseForm(inputTable, firstDate)).toEqual(expected)
})

test("tableFormToDatabaseForm_3ConsecutiveAcrossTwoDays_OneAvailability", () =>{

    const inputTable:boolean[][] = [new Array<boolean>(48).fill(false), new Array<boolean>(48).fill(false)]

    inputTable[0].fill(true, 46)
    inputTable[1][0] = true

    const firstDate = new Date("1970-01-01T00:00:00")
    
    const expected:Availability[] = [ 
        {start: new Date("1970-01-01T23:00:00"), end: new Date("1970-01-02T00:30:00")},
    ]

    expect(tableFormToDatabaseForm(inputTable, firstDate)).toEqual(expected)
})

test("tableFormToDatabaseForm_2SetsOfThreeConsecutiveTrue_TwoAvailabilities", () =>{

    const inputTable:boolean[][] = [new Array<boolean>(48).fill(false)]

    inputTable[0].fill(true, 0, 3)
    inputTable[0].fill(true, 6, 9)

    const firstDate = new Date("1970-01-01T00:00:00")
    
    const expected:Availability[] = [ 
        {start: new Date("1970-01-01T00:00:00"), end: new Date("1970-01-01T01:30:00")},
        {start: new Date("1970-01-01T03:00:00"), end: new Date("1970-01-01T04:30:00")},
    ]

    expect(tableFormToDatabaseForm(inputTable, firstDate)).toEqual(expected)
})

test("tableFormToDatabaseForm_TwoAvailabilitiesTwoDates_TwoAvailabilities", () =>{

    const inputTable:boolean[][] = [new Array<boolean>(48).fill(false), new Array<boolean>(48).fill(false)]

    inputTable[0].fill(true, 2, 6)
    inputTable[1].fill(true, 4, 12)

    const firstDate = new Date("1970-01-01T00:00:00")
    
    const expected:Availability[] = [ 
        {start: new Date("1970-01-01T01:00:00"), end: new Date("1970-01-01T03:00:00")},
        {start: new Date("1970-01-02T02:00:00"), end: new Date("1970-01-02T06:00:00")},
    ]

    expect(tableFormToDatabaseForm(inputTable, firstDate)).toEqual(expected)
})

test("dateTimeToArrayCoordinates_MidnightFirstDay_(0,0)", () => {
    const targetDate = new Date("1970-01-01T00:00:00")
    const firstDate = new Date("1970-01-01T00:00:00")

    const coords = dateTimeToArrayCoordinates(targetDate, firstDate)

    expect(coords).toEqual({column: 0, row: 0})
})

test("dateTimeToArrayCoordinates_MiddayFirstDay_(0,24)", () => {
    const targetDate = new Date("1970-01-01T12:00:00")
    const firstDate = new Date("1970-01-01T00:00:00")

    const coords = dateTimeToArrayCoordinates(targetDate, firstDate)

    expect(coords).toEqual({column: 0, row: 24})
})

test("dateTimeToArrayCoordinates_MidnightSecondDay_(1,0)", () => {
    const targetDate = new Date("1970-01-02T00:00:00")
    const firstDate = new Date("1970-01-01T00:00:00")

    const coords = dateTimeToArrayCoordinates(targetDate, firstDate)

    expect(coords).toEqual({column: 1, row: 0})
})

test("dateTimeToArrayCoordinates_MiddaySecondDay_(1,24)", () => {
    const targetDate = new Date("1970-01-02T12:00:00")
    const firstDate = new Date("1970-01-01T00:00:00")

    const coords = dateTimeToArrayCoordinates(targetDate, firstDate)

    expect(coords).toEqual({column: 1, row: 24})
})

test("dateTimeToArrayCoordinates_FirstDateNotMidnight_Error", () => {
    const targetDate = new Date("1970-01-02T12:00:00")
    const firstDate = new Date("1970-01-01T01:00:00")

    expect(() => dateTimeToArrayCoordinates(targetDate, firstDate)).toThrowError()
})

test("dateTimeToArrayCoordinates_TargetDateBeforeFirstDate_Error", () => {
    const targetDate = new Date("1970-01-01T12:00:00")
    const firstDate = new Date("1970-01-02T00:00:00")

    expect(() => dateTimeToArrayCoordinates(targetDate, firstDate)).toThrowError()
})

test("databaseFormToTableForm_Empty_Empty", () => {
    
    const availabilities:Availability[] = []
    const firstDate = new Date("1970-01-01T00:00:00")

    const expectedTimeTable:boolean[] = []

    const timetable = databaseFormToTableForm(availabilities, firstDate)
    expect(timetable).toEqual(expectedTimeTable)
})

test("databaseFormToTableForm_OneAvailability01:00-03:30", () => {
    
    const availabilities = [{start: new Date("1970-01-01T01:00:00"), end: new Date("1970-01-01T03:30:00")}]
    const firstDate = new Date("1970-01-01T00:00:00")

    const expectedTimeTable = [new Array<boolean>(48).fill(false)]
    expectedTimeTable[0].fill(true, 2, 7)

    const timetable = databaseFormToTableForm(availabilities, firstDate)
    expect(timetable).toEqual(expectedTimeTable)
})

test("databaseFormToTableForm_TwoAvailabilitiesSameDay", () => {
    
    const availabilities = [
        {start: new Date("1970-01-01T01:00:00"), end: new Date("1970-01-01T03:30:00")},
        {start: new Date("1970-01-01T04:30:00"), end: new Date("1970-01-01T09:00:00")},
    ]
    const firstDate = new Date("1970-01-01T00:00:00")

    const expectedTimeTable = [new Array<boolean>(48).fill(false)]
    expectedTimeTable[0].fill(true, 2, 7)
    expectedTimeTable[0].fill(true, 9, 18)

    const timetable = databaseFormToTableForm(availabilities, firstDate)
    expect(timetable).toEqual(expectedTimeTable)
})

test("databaseFormToTableForm_TwoAvailabilitiesDifferentDay", () => {
    
    const availabilities = [
        {start: new Date("1970-01-01T01:00:00"), end: new Date("1970-01-01T03:30:00")},
        {start: new Date("1970-01-02T04:30:00"), end: new Date("1970-01-02T09:00:00")},
    ]
    const firstDate = new Date("1970-01-01T00:00:00")

    const expectedTimeTable = [new Array<boolean>(48).fill(false), new Array<boolean>(48).fill(false)]
    expectedTimeTable[0].fill(true, 2, 7)
    expectedTimeTable[1].fill(true, 9, 18)

    const timetable = databaseFormToTableForm(availabilities, firstDate)
    expect(timetable).toEqual(expectedTimeTable)
})

test("databaseFormToTableForm_OneAvailabilityAcross2Days", () => {
    
    const availabilities = [
        {start: new Date("1970-01-01T23:00:00"), end: new Date("1970-01-02T00:30:00")},
    ]
    const firstDate = new Date("1970-01-01T00:00:00")

    const expectedTimeTable = [new Array<boolean>(48).fill(false), new Array<boolean>(48).fill(false)]
    expectedTimeTable[0].fill(true, 46)
    expectedTimeTable[1][0] = true

    const timetable = databaseFormToTableForm(availabilities, firstDate)
    expect(timetable).toEqual(expectedTimeTable)
})

test("databaseFormToTableForm_OneAvailabilityAcross3Days", () => {
    
    const availabilities = [
        {start: new Date("1970-01-01T23:00:00"), end: new Date("1970-01-03T00:30:00")}
    ]
    const firstDate = new Date("1970-01-01T00:00:00")

    const expectedTimeTable = [new Array<boolean>(48).fill(false), new Array<boolean>(48).fill(true), new Array<boolean>(48).fill(false),]
    expectedTimeTable[0].fill(true, 46)
    expectedTimeTable[2][0] = true

    const timetable = databaseFormToTableForm(availabilities, firstDate)
    expect(timetable).toEqual(expectedTimeTable)
})