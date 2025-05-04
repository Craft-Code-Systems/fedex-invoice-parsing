<script lang="ts">
	// Stores
	import * as Skeleton from '@skeletonlabs/skeleton';

	// Props
	/** Exposes parent props to this component. */


	const modalStore = Skeleton.getModalStore();


	// Base Classes
	const cBase = 'card p-4  shadow-xl space-y-4';
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="{cBase}">
		<Skeleton.ProgressRadial value={undefined} />
	</div>
{/if}
