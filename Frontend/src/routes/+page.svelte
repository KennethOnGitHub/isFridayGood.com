<script lang="ts">
    import Calendar from "$lib/calendar.svelte";

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
            <input type = 'text'
            placeholder = "EVENT NAME"
            bind:this={eventTitleInput}
            on:input={() => {eventTitleInput.style.width = (eventTitleInput.value.length > 10 ? eventTitleInput.value.length + 'ch' : "10ch")}}
            >
            <button on:click={() => eventTitleInput.focus()}><img src="/edit_square.svg" alt=''></button>
        </div>
        

        <!-- I did the below because input fields that expand to content do not work on safari or firefox yet -->
        <!-- <span class = "event-title" role='textbox' tabindex="1" contenteditable on:focus={() => {eventText = ""}}> 
            {eventText}
            <img src="/edit_square.svg" alt=''>
        </span> -->
    </div>

    <Calendar />

    <div class = "bottom">
        <div class = "time-zone-select">
            <img src = /globe.svg alt=🌐>
            <p>TIME ZONE:</p>
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
        display: grid;
        justify-items: center;
    }
    nav {
        grid-area: nav;
    }
    .event-title {
        grid-area: title;
    }

    @media screen and (max-width: 1000px) {
        .top {
            grid-template-areas: 'nav'
            'title';
        }
    }
    @media not screen and (max-width: 1000px) {
        .top {
            grid-template-columns: 2fr 1fr 2fr;
            grid-template-areas: '. title nav'
        }
        nav {
            justify-self: end;
        }
    }

    ul{
        display: flex;
        list-style: none;
    }
    .event-title {
        display: flex;
        font-size: x-large;
    }

    .event-title input {
        box-sizing: content-box;
        width: 10ch;
    }

    .bottom {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        justify-content: space-between;
        justify-items: center;
    }
    .time-zone-select {
        display: flex;
        align-items: center;
        justify-self: start;
    }

    .create-button {
        font-size: xx-large;
        cursor: pointer;
    }

    .more-settings {
        all: unset;
        display: flex;
        align-items: center;
        cursor: pointer;

        justify-self: end;
    }
    .more-settings p {
        text-decoration: underline;
    }
</style>


