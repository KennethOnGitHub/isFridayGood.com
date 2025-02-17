<script lang="ts">
    let { respondents, eventCode }: { respondents: string[], eventCode: string} = $props()

    let displayDropDown = $state(false)
</script>

<div>
    <button class = "dropdown-button" onclick={() => displayDropDown = !displayDropDown}>Edit Response</button> 
    {#if displayDropDown}
        
    <ul class = "dropdown-item-container">
        {#each respondents as respondent}
            <li>
                <a href = {`/${eventCode}/edit-response/${respondent}`}>{respondent} </a>
            </li>
        {/each}
    </ul>
    {/if}
</div>

<style>
    .dropdown-button {
        all: unset;
        cursor: pointer;
        text-decoration: underline;
    }

    .dropdown-item-container {
        display: flex;
        position: absolute;
        flex-direction: column;
        background-color: white;
        z-index: 100;

        list-style-type: none;
        margin: 0;
        padding: 0;

    }

    .dropdown-item-container li {
        border: solid 1px #0000006f;
    }

    a {
        color: black;
    }
</style>