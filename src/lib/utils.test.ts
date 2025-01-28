import { expect, test} from 'vitest'
import { tableFormToDatabaseForm, type Availability } from './utils'

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

test("tableFormToDatabaseForm_2SetsOfThreeConsecutiveTrue_TwoAvailabilitise", () =>{

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

test("tableFormToDatabaseForm_ThreeConsecutiveAcrossDay_OneAvailability", () =>{

    const inputTable:boolean[][] = [new Array<boolean>(48).fill(false), new Array<boolean>(48).fill(false)]

    inputTable[0].fill(true, 46)
    inputTable[1][0] = true

    const firstDate = new Date("1970-01-01T00:00:00")
    
    const expected:Availability[] = [ 
        {start: new Date("1970-01-01T23:00:00"), end: new Date("1970-01-01T00:30:00")},
    ]

    expect(tableFormToDatabaseForm(inputTable, firstDate)).toEqual(expected)
})