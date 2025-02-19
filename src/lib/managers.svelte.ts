import * as settings from "$lib/settings"
import  { dateTimeToArrayCoordinates, type EventViewModel, MILLISECONDS_IN_SECOND, MILLISECONDS_PER_TIME_SLOT, SECONDS_PER_MINUTE, TIME_SLOTS_PER_DAY,  } from "./utils";

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
        this.highlighter.availabilityData.firstDate.setHours(0, 0, 0, 0); //bit ugly. firstDate should probably not be part of availabilityData but the benefit of the refactor is not worth it.
    }

    async submitEvent(): Promise<Response>{

        const response:Response = await fetch("/api/events" , {
            method: 'POST',
            body: JSON.stringify({ 
                title: this.eventTitle,
                availability: this.highlighter.availabilityData.availability,
                firstDate: this.highlighter.availabilityData.firstDate.toISOString()
                })
        })

        return response
    }
}

export class EditEventManager implements Manager{
    timezone: number;
    eventTitle: string;
    highlighter: HostHighlighter;
    inviteCode: string;

    constructor(eventTitle: string, eventCode: string, availabilities: boolean[][], firstDate: Date) {
        this.timezone = 0;
        this.eventTitle = eventTitle;
        this.inviteCode = eventCode;

        this.highlighter = new HostHighlighter(availabilities, firstDate);
    }

    async editEvent() {
        const response:Response = await fetch(`/api/events/${this.inviteCode}` , {
            method: 'PUT',
            body: JSON.stringify({ 
                title: this.eventTitle,
                availability: this.highlighter.availabilityData.availability,
                firstDate: this.highlighter.availabilityData.firstDate.toISOString()
                })
        })

        return response
    }
}

class HostHighlighter implements Highlighter {
    availabilityData: {firstDate: Date, availability: boolean[][]} = $state({
        firstDate: new Date(0),
        availability:[[]]});

    constructor(inputAvailability?: boolean[][], firstDate?: Date) {
        if (inputAvailability != undefined && firstDate != undefined) {
            this.availabilityData.availability = inputAvailability;
            this.availabilityData.firstDate = firstDate
        }else {
            this.availabilityData.availability = new Array<Array<boolean>>()
            this.availabilityData.firstDate = new Date()
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
    highlighter: AttendeeHighlighter;
    inviteCode: string;

    constructor(inviteCode: string, eventTitle: string, firstDate: Date, hostAvailability: boolean[][]) {
        this.timezone = 0;
        this.eventTitle = eventTitle;
        this.inviteCode = inviteCode;
        
        this.highlighter = new AttendeeHighlighter(firstDate, [], hostAvailability);
    }

    async submitResponse(username: string) {
        const response:Response = await fetch(`/api/events/${this.inviteCode}/responses` , {
            method: 'POST',
            body: JSON.stringify({ 
                username: username,
                availability: this.highlighter.availabilityData.attendeeAvailability,
                firstDate: this.highlighter.availabilityData.firstDate.toISOString()
                })
        })

        return response
    }
}

export class EditResponseManager implements Manager {
    timezone: number;
    eventTitle: string;
    highlighter: AttendeeHighlighter;
    inviteCode: string;
    username: string;

    constructor(inviteCode: string, eventTitle: string, username: string, firstDate: Date, attendeeAvailability: boolean[][], hostAvailability: boolean[][]) {
        //send query
        this.timezone = 0; 
        this.inviteCode = inviteCode;
        this.eventTitle = eventTitle;
        this.username = username

        this.highlighter = new AttendeeHighlighter(firstDate, attendeeAvailability, hostAvailability);
    }

    async submitEdit(): Promise<Response> {
        const response:Response = await fetch(`/api/events/${this.inviteCode}/responses/${this.username}`, {
            method: "PUT",
            body: JSON.stringify({
                availability: this.highlighter.availabilityData.attendeeAvailability,
                firstDate: this.highlighter.availabilityData.firstDate
            }),
        })

        return response
    }
}

class AttendeeHighlighter implements Highlighter {
    availabilityData: {firstDate: Date, attendeeAvailability: boolean[][], hostAvailability: boolean[][]} = $state({
        firstDate: new Date(),
        attendeeAvailability: [[]],
        hostAvailability: [[]],
    })

    constructor(firstDate: Date, attendeeAvailability: boolean[][], hostAvailability: boolean[][]) {
        this.availabilityData.firstDate = firstDate
        this.availabilityData.attendeeAvailability = attendeeAvailability
        this.availabilityData.hostAvailability = hostAvailability
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
    highlighter: ResultsHighlighter;
    inviteCode: string
    displayBookedScreen: boolean = $state(false)

    constructor(event: EventViewModel) {
        this.timezone = 0; 
        this.eventTitle = event.eventData.name
        this.inviteCode = event.eventData.code
        this.displayBookedScreen = (event.eventData.selectedTime != null)

        this.highlighter = new ResultsHighlighter(event.availabilities, event.eventData.firstDate, event.eventData.selectedTime)
    }

    async bookTime() {

        const timeSlotsAfterFirstDate = (this.highlighter.confirmedTime.column * TIME_SLOTS_PER_DAY) + this.highlighter.confirmedTime.row
        const timeAfterFirstDate = timeSlotsAfterFirstDate * MILLISECONDS_PER_TIME_SLOT
        const bookedDateTime: Date = new Date(this.highlighter.availabilityData.firstDate.getTime() + timeAfterFirstDate)


        await fetch(`/api/events/${this.inviteCode}/select-time`, {
            method: 'PUT',
            body: JSON.stringify({bookedTime: bookedDateTime})
            })
        
        location.reload()//This is slightly messy as we are reloading the WHOLE page, however, it keeps the system simple and prevents bugs.
        //It also hurts less in the event of a race condition
    }   
}

class ResultsHighlighter implements Highlighter {
    availabilityData: {firstDate: Date, availabilities: number[][][], respondents: string[]} = $state({
        firstDate: new Date(0),
        availabilities: [[[]]],
        respondents: [],
    });
    selectedRespondentID?: number = $state(undefined);
    confirmedTime: {column: number, row: number} = $state({column: 0, row: 0});
    availableAttendees: number[] = $state([])


    constructor(inputAvailabilities: Map<string, boolean[][]>, firstDate: Date, selectedTime?: Date) {

        this.availabilityData.firstDate = firstDate
        
        // const availabilitiesColumnCount = Math.max(...[...availabilities.values()].map(table => table.length)) //utterly unreadable!

        //Makes the 3D array the right size
        const inputAvailabilitiesLengths:number[] = [...inputAvailabilities.values()].map(table => table.length) //Gets the length of each table
        const largestAvailabilityTableSize:number = Math.max(...inputAvailabilitiesLengths)
        this.availabilityData.availabilities = new Array(largestAvailabilityTableSize).fill(new Array(48).fill([]))

        const usernames = [...inputAvailabilities.keys()]
        //Inserts each users availabilities into the 3D array
        for (let userId = 0; userId < usernames.length; userId++) {
            const curUsername = usernames[userId]
            const curUsersAvailabilities = inputAvailabilities.get(curUsername)!
            this.availabilityData.respondents.push(curUsername)
            
            for (let column = 0; column < curUsersAvailabilities.length; column++) {
                for (let row = 0; row < TIME_SLOTS_PER_DAY; row++) {
                    if (curUsersAvailabilities[column][row] == true) {
                        this.availabilityData.availabilities[column][row].push(userId)
                    }
                }
            }
        }

        if (selectedTime) {
            this.confirmedTime = dateTimeToArrayCoordinates(selectedTime, firstDate) //IMPLEMENT SUGGESTING TIMES
        }else {
            //Finds the time slot where the most people are free
            let largest = -999
            const currentTime = dateTimeToArrayCoordinates(new Date(), firstDate)

            for (let column = currentTime.column; column < this.availabilityData.availabilities.length; column++) {
                for (let row = 0; row < TIME_SLOTS_PER_DAY; row++) {
                    if (this.availabilityData.availabilities[column][row].length > largest) {
                        this.confirmedTime = {column, row}
                        largest = this.availabilityData.availabilities[column][row].length
                    }
                }
            }
        }

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