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

export class EventCreationManager implements Manager{
    timezone: number;
    eventTitle: string;
    highlighter: HostHighlighter;

    constructor() {
        this.timezone = 0;
        this.eventTitle = "";

        this.highlighter = new HostHighlighter();
    }

    async submitEvent(){

        const response:Response = await fetch("/api/events" , {
            method: 'POST',
            body: JSON.stringify({ 
                title: this.eventTitle,
                availability: this.highlighter.availabilityData.availability,
                firstDate: this.highlighter.availabilityData.firstDate.toISOString() //Converting to ISO String accounts for timezones
             })
        })

    }
}

export class EditEventManager implements Manager{
    timezone: number;
    eventTitle: string;
    highlighter: Highlighter;
    inviteCode: string;

    constructor(inviteCode: string) {
        //query database

        this.timezone = 0;
        this.eventTitle = "SAMS EPIC TEA PARTY";
        this.inviteCode = inviteCode;

        this.highlighter = new HostHighlighter();
    }

    editEvent() {
        //send request
        console.log("afiashfiashfiashfa")
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

export class CreateResponseManager implements Manager{
    timezone: number;
    eventTitle: string;
    highlighter: Highlighter;
    inviteCode: string;

    constructor(inviteCode: string) {
        this.timezone = 0;
        this.eventTitle = "Christmas Dinner at the Newman Household :D";
        this.inviteCode = inviteCode;
        
        this.highlighter = new AttendeeHighlighter();
    }

    submitResponse() {
        console.log("you haven't implemented this ken!!!")
    }
}

export class EditResponseManager implements Manager {
    timezone: number;
    eventTitle: string;
    highlighter: Highlighter;
    inviteCode: string;
    userName: string;

    constructor(inviteCode: string, userName: string) {
        //send query
        this.timezone = 0; 
        this.eventTitle = "Test title";
        this.inviteCode = inviteCode;
        this.userName = userName;

        this.highlighter = new AttendeeHighlighter();
    }

    submitEdit() {

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

export class ViewResultsManager implements Manager {
    timezone: number;
    eventTitle: string;
    highlighter: ResultsHighlighter;//<-could do this for others?
    inviteCode: string;

    constructor(inviteCode: string) {
        this.timezone = 0; //PLACEHOLDER
        this.eventTitle = "Christmas Dinner at the Newman Household :D",
        this.inviteCode = inviteCode;

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
    confirmedTime: {column: number, row: number} = $state({column: 0, row: 0});
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
        let style = "";
        if (this.confirmedTime.column == column && this.confirmedTime.row == row) {
            style += "text-decoration: underline; font-weight: bold;"
        }

        const outOfRange:boolean = column >= this.availabilityData.availabilities.length; 
        if (outOfRange) return style;

        const noResponses:boolean = (this.availabilityData.respondents.length == 0)
        if (noResponses) return style;

        const notFilteringResponses:boolean = (this.selectedRespondentID == undefined) 
        if (notFilteringResponses) {
            const ratio = this.availabilityData.availabilities[column][row].length / this.availabilityData.respondents.length;
            if (ratio == 1) {
                style += `background-color: ${settings.GREEN}`;
            }else if (ratio >= 0.5) {
                style += `background-color: ${settings.YELLOW}`;
            }
            else if (ratio > 0){
                style += `background-color: ${settings.ORANGE}`;
            }
        // @ts-ignore <- need this as TS does not realise that selectedRespondent is defined
        }else if(this.availabilityData.availabilities[column][row].includes(this.selectedRespondentID)) {
            style += `background-color: ${settings.GREEN}`;
        }
        return style;
    }

    handleClick(column: number, row: number): void {
        this.confirmedTime = {column, row}
    }

    handlePointerEnter(column: number, row: number, event: PointerEvent): void {
        if (column >= this.availabilityData.availabilities.length) {
            this.availableAttendees = [];  
                
        }else {
            this.availableAttendees = this.availabilityData.availabilities[column][row];
        }
    }

}