<script lang="ts">
    let columnCount:number = $state(30);
    //30 completely a magic number, I chose this number as it should be enough columns to fit initially on a page
    //columnCount is a reactive element as the number of columns increases as the user scrolls, therefore is must be able to
    //dynamically change and affect the DOM

    let timetable: HTMLDivElement;

    function updateColumnCount() {
        //Checks how close the user is to the edge of the container, increases columnCount (and therefore adds more columns)
        //when user is close to the edge
        const fromRight:number = timetable.scrollWidth - timetable.clientWidth - timetable.scrollLeft;

        //columnCount can only increase, this is because if the user scrolls back left I do not want columns that possibly have data
        //filled in to be deleted
        if (fromRight < 40) {
            columnCount++;
        }
    }

    //This HAS to be instantiated once as it avoids errors caused when the user is using the service around midnight
    const userLoadPageDate = new Date();

    const daysOfTheWeek:string[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
    const currentDay:number = userLoadPageDate.getDay();

    function getColumnDate(dayIndex: number) {
        //Tad inneficient since we are creating new objects, but creating one object that we then incremement day by day could lead
        //to problems as if we are ever getting the column date out of order we will get the wrong date
        let columnDate:Date = new Date(userLoadPageDate);
        columnDate.setDate(columnDate.getDate() + dayIndex)
        
        const dateFormat: Intl.DateTimeFormatOptions = {
            day: "numeric",
            month: "short"
        }

        return columnDate.toLocaleString('en-GB', dateFormat)
    }

    function createTimeString(timeIndex: number) {
        const hour:number = Math.floor(timeIndex/2);
        const formattedHours:string = hour.toLocaleString('en-US', {minimumIntegerDigits: 2});

        const isHalfHour:boolean = (timeIndex % 2) == 1;
        const minutes:string = isHalfHour ? "30" : "00";

        return `${formattedHours}:${minutes}`;
    }    
</script>

<div class = "timetable" bind:this={timetable} onscroll={updateColumnCount}>
    <!-- Repeats code columnCount number of times. Effectively for(i = 0; i < columnCount; i++) {} -->
    {#each {length: columnCount} as _, i} 

    <div class = {"timetable-column " + (i == 0 ? "timetable-column-start" : "")}>
        <div class = column-header>
            <h2>{daysOfTheWeek[(currentDay + i) % 7]}</h2>
            <h3>{getColumnDate(i)} </h3>
        </div>
            <div>
                <!-- Repeats 48 times as there are 24 hours in a day and there is a half hour for each hour -->
                {#each {length: 48} as _, j}
                    <p class={(j % 2 == 1) ? "half-hour" : ""}>{createTimeString(j)}</p>
                {/each}
            </div>
        </div>
    {/each}
</div>

<style>
    .timetable {
        display: flex;
        flex-direction: row;
        overflow: scroll;
        margin: 1em;
    }

    .timetable-column {
        border-right: solid 2px;
        width: 5em;
        flex-shrink: 0;
        height: fit-content;
        
        display: grid;
        justify-items: center;
        text-align: center;
    }

    .timetable-column-start {
        border: solid;
        border-width: 0px 2px;
    }

    .half-hour {
        font-size:smaller;
    }

    .column-header {
        position: sticky;
        background-color: white;
        width: 100%;
        top: 0px;
    }

    .column-header h2, .column-header h3 {
        font-weight: normal;
    }
</style>

