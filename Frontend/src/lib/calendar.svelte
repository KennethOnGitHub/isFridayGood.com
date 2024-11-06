<script lang="ts">
    let columncount:number = $state(30);

    let calendar: HTMLDivElement;

    function calculateColumnCount() {
        const fromRight: number = calendar.scrollWidth - calendar.clientWidth - calendar.scrollLeft;

        if (fromRight < 40) {
            columncount++;
        }
    }

    const daysOfTheWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
    const currentDay = new Date().getDay();

    function createTimeString(timeIndex: number) {
        const hour:number = Math.floor(timeIndex/2)
        const isHalfHour:boolean = (timeIndex % 2) == 1;

        return `${hour.toLocaleString('en-US', {minimumIntegerDigits: 2})}:${isHalfHour ? "30" : "00"}`;
    }
</script>

<div class = "calendar" bind:this={calendar} onscroll={calculateColumnCount}>
    {#each {length: columncount} as _, i}
        <div class = {"calendar-column " + (i == 0 ? "calendar-column-start" : "")}>
            <h2>{daysOfTheWeek[(currentDay + i) % 7]}</h2>

            <div>
                {#each {length: 48} as _, i}
                    <p class={(i % 2 == 1) ? "half-hour" : ""}>{createTimeString(i)}</p>
                {/each}
            </div>
        </div>
    {/each}
</div>

<style>
    .calendar {
        display: flex;
        flex-direction: row;
        overflow: scroll;
        padding: 1em;
    }

    .calendar-column {
        border-right: solid 2px;
        width: 5em;
        flex-shrink: 0;
        
        display: grid;
        justify-items: center;
    }

    .calendar-column-start {
        border: solid;
        border-width: 0px 2px;
    }

    .half-hour {
        font-size:smaller;
    }


</style>

