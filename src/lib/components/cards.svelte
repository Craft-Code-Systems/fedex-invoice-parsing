<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';

    export let visible: boolean = false;
    export let message: string = '';
    export let type: string = '';
    export let title: string = '';
    export let fields: any = {};
    export let image: string = '';
    export let version: string = '';  
    export let name: string = '';
    let filled_fields: any = {};

// Get cookie (if exists) and fill filled_fields
// Check if document is loaded

onMount(() => {
    if (!browser) return;

  const cookies = document.cookie;
  const cookieArray = cookies.split('; ');
  for (let i = 0; i < (cookieArray.length -1); i++) {
    const cookiePair = cookieArray[i].split('=');
    filled_fields[cookiePair[0]] = cookiePair[1];
  }
});


async function connectAddon() {


    // build up the auth object from fields
    const authPayload = Object.fromEntries(
      // assume fields is a string[] of keys
      fields.map((k) => [k, filled_fields[k] || ''])
    );

    const body = JSON.stringify({
      plugin: name,
      auth:   authPayload
    });

    const res = await fetch('/api/addons', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    });

    if (!res.ok) {
      console.error('connect error', res.status);
      return;
    }
    // console.log(await res.json());
    const response = await res.json();
    filled_fields = response.result
    // Set cookie
    document.cookie = `web_bearer_token=${filled_fields.web_bearer_token}; SameSite=Lax; Secure; Path=/; Max-Age=14400`;
    document.cookie = `web_client_id=${filled_fields.web_client_id}; SameSite=Lax; Secure; Path=/; Max-Age=14400`;
    document.cookie = `web_client_id=${filled_fields.web_client_id}; SameSite=Lax; Secure; Path=/; Max-Age=14400`;
    document.cookie = `web_client_username=${filled_fields.web_client_username}; SameSite=Lax; Secure; Path=/; Max-Age=14400`;
    document.cookie = `web_client_password=${filled_fields.web_client_password}; SameSite=Lax; Secure; Path=/; Max-Age=14400`;
    document.cookie = `web_account_number=${filled_fields.web_account_number}; SameSite=Lax; Secure; Path=/; Max-Age=14400`;
    document.cookie = `web_client_cookie=${filled_fields.web_client_cookie}; SameSite=Lax; Secure; Path=/; Max-Age=14400`;
    

  }



</script>

{#if visible}

<div
  class="card bg-primary-500 h-full border-[1px] border-surface-200-800 card-hover divide-surface-200-800 block max-w-md divide-y overflow-hidden --color-primary-500"
>
  <!-- Header -->
  <header>
    <img src={image} class="aspect-[21/9] w-full grayscale hue-rotate-90" alt="banner" />
  </header>
  <!-- Main -->
  <article class="space-y-4 p-4">
    <div>
      <h2 class="h6">{type}</h2>
      <h3 class="h3">{title}</h3>
    </div>
    <p class="opacity-60">
      {message}
    </p>
      <hr class="hr border-t-2" />



  <form class="space-y-6" on:submit|preventDefault={connectAddon} method="POST">

    {#each Object.entries(fields) as [key, value]}
    <div>
        <label for={key}>{value}</label>
        <input bind:value={filled_fields[key, value]} type="text" name={key} id={key}  required class="block w-full rounded-md bg-white px-3 py-1.5 text-base  outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
    </div>
{/each}


    <div>
      <button  type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Connect Addon</button>
    </div>
  </form>

  </article>
  <!-- Footer -->
  <footer class="flex items-center justify-between gap-4 p-4">
    <small class="opacity-60">Addon: <b>{name}</b></small>
    <small class="opacity-60">Version: <b>{version}</b></small>
  </footer>
</div>
{/if}