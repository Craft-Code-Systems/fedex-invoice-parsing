<script lang="ts">
    export let visible: boolean = false;
    export let message: string = '';
    export let title: string = '';
</script>

{#if visible}
<aside class="alert variant-ghost-error">
    <!-- Icon -->
    <div><span class="material-symbols-outlined">
        warning
        </span></div>
    <!-- Message -->
    <div class="alert-message">
        <h3 class="h3">{title}</h3>
        <p>{message}</p>
    </div>
    <!-- Actions -->
</aside>
{/if}