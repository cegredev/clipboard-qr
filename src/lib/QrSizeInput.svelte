<script lang="ts">
	import { DEFAULT_QR_SIZE, QR_SIZES } from "./qr";

	export let size: number;
	let qrCustomSize: boolean = false;
</script>

<div class="join">
	{#each QR_SIZES as _size}
		<input
			class="join-item btn"
			type="radio"
			name="size"
			aria-label={`${_size}px`}
			checked={_size === DEFAULT_QR_SIZE}
			on:click={() => {
				size = _size;
				qrCustomSize = false;
			}}
		/>
	{/each}
	<input
		class="join-item btn"
		type="radio"
		name="size"
		aria-label={"Custom"}
		on:click={() => (qrCustomSize = true)}
	/>
</div>

{#if qrCustomSize}
	<label class="input w-full">
		Custom size
		<input type="number" bind:value={size} />
	</label>
{/if}
