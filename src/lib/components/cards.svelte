<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';

	export let visible: boolean = false;
	export let message: string = '';
	export let type: string = '';
	export let title: string = '';
	export let fields: any = {};
	export let image: string = '';
	export let version: string = '';
	export let name: string = '';
	let filled_fields: any = {};
	export let sessionIdCookie: string = '';


	// Get cookie (if exists) and fill filled_fields
	// Check if document is loaded

  if (sessionIdCookie !== '') {
    retrieveAddonAuth(sessionIdCookie);
    } else {
      console.log("no sessionIdCookie");
    }

	async function retrieveAddonAuth(sessionIdCookie: string) {
		const res = await fetch(`/api/addons/auth?sessionId=${sessionIdCookie}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});
		const response = await res.json();
    filled_fields = response.data.auth;
	}



	async function saveAddonAuth() {
    const sessionId = uuidv4();
		document.cookie = `sessionId=${sessionId}; SameSite=Lax; Secure; Path=/; Max-Age=14400`;

		// build up the auth object from fields
		const authPayload = Object.fromEntries(
			// assume fields is a string[] of keys
			fields.map((k) => [k, filled_fields[k] || ''])
		);

		const body = JSON.stringify({
			plugin: name,
			auth: authPayload,
			sessionId: sessionId
		});

		const res = await fetch('/api/addons/auth', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body
		});

		if (!res.ok) {
			console.error('connect error', res.status);
			return;
		}
		console.log(await res.json());

		// // Set cookie
		// document.cookie = `web_bearer_token=${filled_fields.web_bearer_token}; SameSite=Lax; Secure; Path=/; Max-Age=14400`;
		// document.cookie = `web_client_id=${filled_fields.web_client_id}; SameSite=Lax; Secure; Path=/; Max-Age=14400`;
		// document.cookie = `web_client_id=${filled_fields.web_client_id}; SameSite=Lax; Secure; Path=/; Max-Age=14400`;
		// document.cookie = `web_client_username=${filled_fields.web_client_username}; SameSite=Lax; Secure; Path=/; Max-Age=14400`;
		// document.cookie = `web_client_password=${filled_fields.web_client_password}; SameSite=Lax; Secure; Path=/; Max-Age=14400`;
		// document.cookie = `web_account_number=${filled_fields.web_account_number}; SameSite=Lax; Secure; Path=/; Max-Age=14400`;
	}

</script>

{#if visible}
	<div
		class="card bg-primary-500 bg-indigo-500 text-white border-surface-200-800 card-hover divide-surface-200-800 --color-primary-500 block h-full max-w-md divide-y overflow-hidden border-[1px]"
	>
		<!-- Header -->
		<header>
			<img src={image} class="aspect-[21/9] w-full " alt="banner" />
		</header>
		<!-- Main -->
		<article class="space-y-4 p-4">
			<div>
				<h2 class="h6">{type}</h2>
				<h3 class="h3 text-xl font-bold">{title}</h3>
			</div>
			<p class="opacity-60">
				{message}
			</p>
			<hr class="hr border-t-2" />

			<form class="space-y-6" on:submit|preventDefault={saveAddonAuth} method="POST">
				{#each Object.entries(fields) as [key, value]}
					<div>
						<label for={key}>{value}</label>
						<input
							bind:value={filled_fields[(key, value)]}
							type="text"
							name={key}
							id={key}
							required
							class="block w-full rounded-md bg-white text-black px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						/>
					</div>
				{/each}

				<div>
					<button
						type="submit"
						class="flex w-full justify-center rounded-md bg-orange-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>Save Addon Auth</button
					>
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
