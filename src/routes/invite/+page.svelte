<script lang="ts">
    import { CreateResponseManager } from "$lib/managers.svelte";
    const createResponseManager = new CreateResponseManager("code123") 
    import Timetable from "$lib/timetable.svelte";
    import TimezoneSelect from "$lib/TimezoneSelect.svelte";
</script>

<div class = "page">
    <div class = "top">
        <nav>
            <ul>
                <li><a href="">View Results</a></li>
                |
                <li><a href="">Edit this Event</a></li>
            </ul>
        </nav>

        <div class = "event-title">
            <p class="subtitle">You've been invited to...</p>
            <p>{createResponseManager.eventTitle}</p> 
            <!-- TODO: make it resize^^^^^^ -->
        </div>
    </div>

    <Timetable manager = {createResponseManager}/>

    <div class = "bottom">
        <TimezoneSelect bind:userTimezone = {createResponseManager.timezone} />
        <button onclick={() => {window.location.href = "/results"}} type="submit" class = "create-button">SUBMIT</button>
        
        <button class = "more-settings">
            <img src=/edit_square.svg alt = '✏️'>
            <p>Edit Submission</p>
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

        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: x-large;
    }

    .subtitle {
        font-size: medium;
    }

    @media screen and (max-width: 1000px) {
        .top {
            grid-template-areas: 'nav'
            'title';
        }
    }
    @media not screen and (max-width: 1000px) {
        .top {
            grid-template-columns: 1fr 2fr 1fr;
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

    li a {
        color: black;
    }

    .bottom {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        justify-content: space-between;
        justify-items: center;
    }

    .create-button {
        font-size: xx-large;
        cursor: pointer;
        filter: drop-shadow(2px 4px 1px #0000006f)
    }

    .create-button:active {
        transform: translate(1px, 2px);
        filter: none;
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


