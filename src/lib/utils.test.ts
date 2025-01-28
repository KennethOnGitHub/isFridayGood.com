import { expect, test} from 'vitest'
import { tableFormToDatabaseForm, type Availability } from './utils'

test("tableFormToDatabaseForm_Empty_Empty", () =>{

    const inputTable:boolean[][] = []
    const firstDate = new Date(0)
    
    const expected:Availability[] = []

    expect(tableFormToDatabaseForm(inputTable, firstDate)).toEqual(expected)
})