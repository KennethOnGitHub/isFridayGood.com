<script lang="ts">

    let eventTitleInput: HTMLInputElement;

    const timezones: number[] = []
    for (let i = -12; i <= 14; i++) {
        timezones.push(i)
    }
    const userTimeZone:number = -(new Date().getTimezoneOffset() / 60);


</script>

<div class = "page">
    <div class = "top">
        <nav>
            <ul>
                <li><a href="">View Results</a></li>
                |
                <li><a href="">Respond to an invite</a></li>
            </ul>
        </nav>

        <div class = "event-title">
            <input type = 'text' placeholder = "EVENT NAME" bind:this={eventTitleInput}>
            <button on:click={() => eventTitleInput.focus()}><img src="/edit_square.svg" alt=''></button>
        </div>
     </div>
    <div class = "calendar"></div>
    <div class = "bottom">
        <div class = "time-zone-slect">
            <select name = "time zone">
                {#each timezones as timezone}
                    {#if timezone == userTimeZone}
                        <option value = {timezone} selected>{`GMT${timezone >= 0 ? '+' : ''}${timezone}`}</option>
                    {:else}
                        <option value = {timezone}>{`GMT${timezone >= 0 ? '+' : ''}${timezone}`}</option>
                    {/if}
                    
                {/each}
            </select>
        </div>
        <button class = "create-button">CREATE</button>
        <button class = "more-settings">
            <img src=/settings.svg alt = '⚙️'>
            <p>More Settings</p>
        </button>
    </div>
</div>

<style>
    div.page {
        padding: 1rem; 
        display: grid;
        grid-template-rows: 60px 1fr 60px;

        height: 100vh;
    }

    .top {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row-reverse;
        align-items: center;
        justify-content: center;
    }
    nav {
        
    }
    ul{
        display: flex;
        list-style: none;
    }
    .event-title {
        display: flex;
    }

    .calendar {
        border: 2px solid black;
    }

    .bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .time-zone-slect {
        width: 100px;
        background-color: green;
    }
    .create-button {
        font-size: xx-large;
    }

    .more-settings {
        display: flex;
        align-items: center;
    }
</style>


