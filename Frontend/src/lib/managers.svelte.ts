import { derived } from "svelte/store";

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


interface HostAvailability {
    firstDate: Date,
    availability: boolean[][],
}

interface AttendeeAvailability {
    firstDate: Date,
    userAvailability: boolean[][],
    hostAvailability: boolean[][],
    
}

interface AllAvailability {
    firstDate: Date,
    availabilities: number[][][]
    
}


class EventCreationManager implements Manager{
    timezone: number;
    eventTitle: string;
    highlighter: Highlighter;

    constructor() {
        const minuteDifferenceBetweenUTCandLocal:number = new Date().getTimezoneOffset();
        this.timezone = -(minuteDifferenceBetweenUTCandLocal / 60);
        
        /*We have to make it negative as Date().getTimezoneOffset returns UTC - Local.
        This means that if local is ahead, Date().getTimezoneOffset returns a negative and if local is behind it returns a positive
        But since timezones are written as how many hours +/- UTC/GMT, I need to make the number negative when it is behind and positive
        when it is ahead*/

        this.eventTitle = "";

        this.highlighter = new HostHighlighter();
    }

    submitEvent() {
        console.log("You haven't implemented this dumbfuck")
        const test = 0/0;
    }
}

class HostHighlighter implements Highlighter {
    availability: boolean[][] = $state([[]]);

    constructor(inputAvailability?: boolean[][]) {
        if (inputAvailability != undefined) {
            this.availability = inputAvailability;
        }else {
            this.availability = new Array<Array<boolean>>()
        }
        
    }

    getSlotStyle(column: number, row: number): string {
        console.log("Recalculating Slot Style...")
        if (column >= this.availability.length) return "";

        return this.availability[column][row] == true ? "background-color: #62FF00" : ""; 
    }

    handleClick(column: number, row: number): void {
        $state.snapshot(this.availability);
        const COLUMN_HEIGHT = 48; //24 hours in a day, then a half hour for each hour.
        
        // Ensure the column exists
        while (this.availability.length <= column) {
            this.availability.push(new Array(COLUMN_HEIGHT).fill(false));
        }

        this.availability[column][row] = !this.availability[column][row];
    }

    handlePointerEnter(column: number, row: number, event: PointerEvent): void {
        const MOUSE_CLICK_PRESSURE = 0.5;
        if (event.pressure >= MOUSE_CLICK_PRESSURE) {
            this.handleClick(column, row)
        }
    }
}

export const eventCreationManager = new EventCreationManager;