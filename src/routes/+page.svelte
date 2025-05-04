<script lang="ts">
  import Cards from '$lib/components/cards.svelte';
  export let data: { plugins: Record<string, { name: string; name_friendly: string; version: string; authFields: string[] }> };
  
  const addonCards=[];

  // loop trought al plugins
  for (const [key, value] of Object.entries(data.plugins)) {
    const pluginMeta = value;
  console.log("pluginMeta: ", pluginMeta);
  const fields = Object.keys(pluginMeta.authFields);
  const webFields  = fields.filter((f) => f.startsWith('web'));
const pluginImg= pluginMeta.name.split('-')[0] + ".png";

console.log("webFields: ", webFields);
addonCards.push({ visible: true, message: pluginMeta.name, title: pluginMeta.name_friendly, fields: webFields, image: pluginImg, version: pluginMeta.version, name: pluginMeta.name });

  }


</script>

<div class="grid h-screen grid-rows-[auto_1fr_auto]">
  <!-- Header -->
	<header class="sticky top-0 z-10 bg-red-500/80 backdrop-blur-sm p-4">
    <h1>FedEx Invoice Parsing</h1>
  </header>
	<!-- Main -->
	<main class="bg-green-500 p-4 space-y-4">
    <div class="grid grid-cols-4 gap-4">
      <div class="h-auto p-4">

    <!-- <Cards visible={visible} message={pluginMeta.name} title={pluginMeta.name_friendly} fields={webFields} image={pluginImg} version={pluginMeta.version}  /> -->
{#each addonCards as card}
<Cards {...card} />
{/each}

	</main>
	<!-- Footer -->
	<footer class="bg-blue-500 p-4">(footer)</footer>
</div>
