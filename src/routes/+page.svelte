<script lang="ts">
	import { browser } from '$app/environment';
	import Cards from '$lib/components/cards.svelte';
	import { onMount } from 'svelte';
	export let data: {
		plugins: Record<
			string,
			{ name: string; name_friendly: string; version: string; authFields: string[] }
		>;
	};

	let sessionIdCookie: string = '';
	let loaded = false;

	onMount(() => {
		if (!browser) return;

		const cookies = document.cookie;
		// const cookieArray = cookies.split('; ');
		// for (let i = 0; i < (cookieArray.length -1); i++) {
		//   const cookiePair = cookieArray[i].split('=');
		//   filled_fields[cookiePair[0]] = cookiePair[1];
		// }

		if (cookies.includes('sessionId=')) {
			sessionIdCookie = cookies.split('sessionId=')[1].split(';')[0];
		}

		const markReady = () => {
			loaded = true;
			window.removeEventListener('load', markReady);
		};

		// If the page is already fully loaded:
		if (document.readyState === 'complete') {
			markReady();
		} else {
			// Otherwise wait for the load event
			window.addEventListener('load', markReady);
		}
	});

	//   // loop trought al plugins
	//   for (const [key, value] of Object.entries(data.plugins)) {
	//     const pluginMeta = value;
	//   console.log("pluginMeta: ", pluginMeta);
	//   const fields = Object.keys(pluginMeta.authFields);
	//   const webFields  = fields.filter((f) => f.startsWith('web'));
	// const pluginImg= pluginMeta.name.split('-')[0] + ".png";

	// addonCards.push({ visible: true, message: pluginMeta.name, title: pluginMeta.name_friendly, fields: webFields, image: pluginImg, version: pluginMeta.version, name: pluginMeta.name, sessionIdCookie: ''});

	//   }

	$: addonCards = Object.entries(data.plugins).map(([key, meta]) => ({
		visible: loaded && sessionIdCookie !== '',
		message: meta.name,
		title: meta.name_friendly,
		fields: meta.authFields.filter((f) => f.startsWith('web')),
		image: `${meta.name.split('-')[0]}.png`,
		version: meta.version,
		name: meta.name,
		sessionIdCookie // ← now carries the up-to-date cookie
	}));

	async function connectAddon(sessionIdCookie: string) {
		// build up the auth object from fields
		const authPayload = Object.fromEntries(
			// assume fields is a string[] of keys
			fields.map((k) => [k, filled_fields[k] || ''])
		);

		const body = JSON.stringify({
			plugin: name,
			auth: authPayload,
			sessionId: sessionIdCookie
		});

		const res = await fetch('/api/addons/connect', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body
		});
		console.log('res: ', await res.json());
		if (!res.ok) {
			console.error('connect error', res.status);
			return;
		}
		// console.log(await res.json());
		const response = await res.json();
		filled_fields = response.result;
	}
</script>

<div class="grid h-screen grid-rows-[auto_1fr_auto]">
	<!-- Header -->
	<header class="sticky top-0 z-10 bg-blue-500/80 p-4 backdrop-blur-sm">
		<h1 class="text-3xl font-bold">FedEx Invoice Parsing</h1>
	</header>
	<!-- Main -->
	<main class="space-y-4 bg-gray-500 p-4">
		<div class="grid grid-cols-4 gap-4">
			<div class="h-auto p-4">
				<!-- Load components after the page is loaded  /> -->
				{#if !loaded}
					<p>Loading…</p>
				{:else}

						{#each addonCards as card}
							<Cards {...card} />
						{/each}

				{/if}
			</div>
		</div>
	</main>
	<!-- Footer -->
	<footer class="p-4">
		<a href="https://github.com/Craft-Code-Systems/fedex-invoice-parsing">
			<button type="button" class="chip preset-filled-surface-500 bg-gray-500 text-white"
				>GitHub</button
			>
		</a>
	</footer>
</div>
