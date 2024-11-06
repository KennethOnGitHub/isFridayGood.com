<script lang="ts">
    let columncount:number = $state(30);

    let calendar: HTMLDivElement;

    function calculateColumnCount() {
        const fromRight: number = calendar.scrollWidth - calendar.clientWidth - calendar.scrollLeft;

        if (fromRight < 40) {
            columncount++;
        }
    }

</script>

<div class = "calendar" bind:this={calendar} onscroll={calculateColumnCount}>
    {#each {length: columncount} as _, i}
        <div class = {"calendar-column " + (i == 0 ? "calendar-column-start" : "")}>

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
    }

    .calendar-column-start {
        border: solid;
        border-width: 0px 2px;
    }


</style>

