<script lang="ts">
	import { DEFAULT_QR_SIZE, QR_SIZES } from "./qr";

	let { size = $bindable() }: { size: number } = $props();

	let pickedSize: number | undefined = $state(DEFAULT_QR_SIZE);
	let enteredSize: number | undefined = $state(undefined);

	function updateSize() {
		if (pickedSize !== undefined) {
			size = pickedSize;
		} else if (enteredSize !== undefined) {
			size = enteredSize;
		} else {
			size = DEFAULT_QR_SIZE;
		}
	}

	updateSize();
</script>

<select class="select" bind:value={pickedSize} onchange={updateSize}>
	{#each QR_SIZES as _size}
		<option class="join-item btn" value={_size}>
			{_size}px
		</option>
	{/each}

	<option class="join-item btn" value={undefined}>Own</option>
</select>

{#if pickedSize === undefined}
	<label class="input w-full">
		<input
			type="number"
			bind:value={enteredSize}
			onchange={updateSize}
			placeholder="Custom size"
		/>
	</label>
{/if}
