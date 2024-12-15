import * as settings from "$lib/settings"

export interface Manager {
    timezone: number,
    eventTitle: string,
    highlighter: Highlighter,
}

interface Highlighter {
    getSlotStyle(column: number, row: number): string
    handlePointerEnter(column: number, row: number, event: PointerEvent): void
    handleClick(column: number, row: number): void
}

class EventCreationManager implements Manager{
    timezone: number;
    eventTitle: string;
    highlighter: Highlighter;

    constructor() {
        this.timezone = 0;
        this.eventTitle = "";

        this.highlighter = new HostHighlighter();
    }

    submitEvent() {
        console.log("You haven't implemented this dumbfuck")
        const test = 0/0;
    }
}

class HostHighlighter implements Highlighter {
    availabilityData: {firstDate: Date, availability: boolean[][]} = $state({
        firstDate: new Date(),
        availability:[[]]});

    constructor(inputAvailability?: boolean[][]) {
        if (inputAvailability != undefined) {
            this.availabilityData.availability = inputAvailability;
        }else {
            this.availabilityData.availability = new Array<Array<boolean>>()
        }
        
    }

    getSlotStyle(column: number, row: number): string {
        if (column >= this.availabilityData.availability.length) return "";

        return this.availabilityData.availability[column][row] == true ? `background-color: ${settings.GREEN}` : ""; 
    }

    handleClick(column: number, row: number): void {
        const COLUMN_HEIGHT = 48; //24 hours in a day, then a half hour for each hour.
        
        // Ensure the column exists
        while (this.availabilityData.availability.length <= column) {
            this.availabilityData.availability.push(new Array(COLUMN_HEIGHT).fill(false));
        }

        this.availabilityData.availability[column][row] = !this.availabilityData.availability[column][row];
    }

    handlePointerEnter(column: number, row: number, event: PointerEvent): void {
        const MOUSE_CLICK_PRESSURE = 0.5;
        if (event.pressure >= MOUSE_CLICK_PRESSURE) {
            this.handleClick(column, row)
        }
    }
}

class CreateResponseManager implements Manager{
    timezone: number;
    eventTitle: string;
    highlighter: Highlighter;
    inviteCode: string;

    constructor() {
        this.timezone = 0;
        this.eventTitle = "Christmas Dinner at the Newman Household :D";
        this.inviteCode = "test123";
        
        this.highlighter = new AttendeeHighlighter();
    }

    submitResponse() {
        console.log("you haven't implemented this ken!!!")
    }


}

class AttendeeHighlighter implements Highlighter {
    availabilityData: {firstDate: Date, attendeeAvailability: boolean[][], hostAvailability: boolean[][]} = $state({
        firstDate: new Date(),
        attendeeAvailability: [[]],
        hostAvailability: [[]],
    })

    constructor() {
        const testData:boolean[][] = [
            new Array(48).fill(false),
            new Array(48).fill(false),
            new Array(48).fill(false),
        ]
        testData[1].splice(12, 8, true, true, true, true, true, true, true, true)
        testData[2].splice(15, 8, true, true, true, true, true, true, true, true)
        this.availabilityData.hostAvailability = testData;
    }

    getSlotStyle(column: number, row: number): string {
        let style = "opacity: 0.5;"
        if (column < this.availabilityData.hostAvailability.length) {
            if (this.availabilityData.hostAvailability[column][row] === true) style = "opacity: 100%;";
        }
        if (column < this.availabilityData.attendeeAvailability.length) {
            if (this.availabilityData.attendeeAvailability[column][row] === true) style = style + `background-color: ${settings.GREEN};`;
        }
        
        return style;
    }

    handleClick(column: number, row: number): void {
        const COLUMN_HEIGHT = 48; //24 hours in a day, then a half hour for each hour.
        
        // Ensure the column exists
        while (this.availabilityData.attendeeAvailability.length <= column) {
            this.availabilityData.attendeeAvailability.push(new Array(COLUMN_HEIGHT).fill(false));
        }

        this.availabilityData.attendeeAvailability[column][row] = !this.availabilityData.attendeeAvailability[column][row];
    }

    handlePointerEnter(column: number, row: number, event: PointerEvent): void {
        const MOUSE_CLICK_PRESSURE = 0.5;
        if (event.pressure >= MOUSE_CLICK_PRESSURE) {
            this.handleClick(column, row)
        }
    } 
}

class ViewResultsManager implements Manager {
    timezone: number;
    eventTitle: string;
    highlighter: ResultsHighlighter;//<-could do this for others?
    inviteCode: string;

    constructor() {
        this.timezone = 0; //PLACEHOLDER
        this.eventTitle = "Christmas Dinner at the Newman Household :D",
        this.inviteCode = "test123";

        this.highlighter = new ResultsHighlighter()
    }

    BookTime() {
        //do stuff
    }

    
}

class ResultsHighlighter implements Highlighter {
    availabilityData: {firstDate: Date, availabilities: number[][][], respondents: string[]} = $state({
        firstDate: new Date(),
        availabilities: [[[]]],
        respondents: ["Simon", "Hamish", "Sammy"],
    });
    selectedRespondentID?: number = $state(undefined);
    bookedTime: {column: number, row: number} = $state({column: 0, row: 0});
    availableAttendees: number[] = $state([])


    constructor() {
        const testData: number[][][] = [
            new Array(48).fill(new Array()),
            new Array(48).fill(new Array()),
            new Array(48).fill(new Array()),
        ]

        testData[1].splice(12, 8, [0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2]);
        testData[2].splice(12, 8, [0, 1], [0, 1], [0, 1], [1, 2], [1, 2], [1, 2], [1], [1]);

        console.log(testData);

        this.availabilityData.availabilities = testData;

    }

    getSlotStyle(column: number, row: number): string {
        // if (column >= this.availabilityData.availabilities.length) return "";
        // if (this.availabilityData.respondents.length == 0) return "";
        
        // if (this.selectedRespondentID == undefined) {
        //     const ratio = this.availabilityData.availabilities[column][row].length / this.availabilityData.respondents.length
        //     if (ratio == 1) {
        //         return `background-color: ${settings.GREEN}`;
        //     }else if (ratio >= 0.5) {
        //         return "background-color: #FFFF00"
        //     }
        //     else if (ratio > 0){
        //         return "background-color: #FFAA00" 
        //     }
        //     else {
        //         return "";
        //     }
        // }else {
        //     return this.availabilityData.availabilities[column][row].includes(this.selectedRespondentID) ? `background-color: ${settings.GREEN}` : "";
        // }
        let style = "";
        if (this.bookedTime.column == column && this.bookedTime.row == row) {
            // style += "border: 2px solid black;"
            style += "text-decoration: underline; font-weight: bold;"
        }

        const outOfRange:boolean = column >= this.availabilityData.availabilities.length; 
        if (outOfRange) return style;

        const noResponses:boolean = (this.availabilityData.respondents.length == 0)
        if (noResponses) return style;

        const notFilteringResponses:boolean = (this.selectedRespondentID == undefined) 
        if (notFilteringResponses) {

            const ratio = this.availabilityData.availabilities[column][row].length / this.availabilityData.respondents.length
            if (ratio == 1) {
                style += `background-color: ${settings.GREEN}`;
            }else if (ratio >= 0.5) {
                style += "background-color: #FFFF00"
            }
            else if (ratio > 0){
                style += "background-color: #FFAA00" 
            }
        // @ts-ignore need this as TS does not realise that selectedRespondent is defined
        }else if(this.availabilityData.availabilities[column][row].includes(this.selectedRespondentID)) {
            style += `background-color: ${settings.GREEN}`;
        }
        return style;
    }

    handleClick(column: number, row: number): void {
        this.bookedTime = {column, row}
    }

    handlePointerEnter(column: number, row: number, event: PointerEvent): void {
        if (column >= this.availabilityData.availabilities.length) {
            this.availableAttendees = [];  
              
        }else {
            this.availableAttendees = this.availabilityData.availabilities[column][row];
        }
    }

}

export const eventCreationManager = new EventCreationManager;
export const createResponseManager = new CreateResponseManager;
export const viewResultsManager = new ViewResultsManager;