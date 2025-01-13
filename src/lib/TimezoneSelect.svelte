<script lang='ts'>
    let { userTimezone=$bindable() }: {userTimezone: number} = $props();

    const timezones: number[] = []
    const furthestAheadTimeZone = 14; //Kiribati
    const furthestBehindTimeZone = -12 //Baker Islands, USA
    for (let i = furthestBehindTimeZone; i <= furthestAheadTimeZone; i++) {
        timezones.push(i)
    }

    const minuteDifferenceBetweenUTCandLocal:number = new Date().getTimezoneOffset();
    userTimezone = -(minuteDifferenceBetweenUTCandLocal / 60);
        
    /*We have to make it negative as Date().getTimezoneOffset returns UTC - Local.
    This means that if local is ahead, Date().getTimezoneOffset returns a negative and if local is behind it returns a positive
    But since timezones are written as how many hours +/- UTC/GMT, I need to make the number negative when it is behind and positive
    when it is ahead*/

</script>

<div class = "time-zone-select">
    <img src = /globe.svg alt=🌐>
    <p>TIME ZONE:</p>
    <select name = "time zone">
        {#each timezones as timezone}
            {#if timezone == userTimezone}
                <option value = {timezone} selected>{`GMT${timezone >= 0 ? '+' : ''}${timezone}`}</option>
            {:else}
                <option value = {timezone}>{`GMT${timezone >= 0 ? '+' : ''}${timezone}`}</option>
            {/if}
            
        {/each}
    </select>
</div>


<style>
    .time-zone-select {
        display: flex;
        align-items: center;
        justify-self: start;
    }

    .time-zone-select select {
        border: none;
        background: none;
        cursor: pointer;
    }

</style>