<script lang="ts">
	let { value = $bindable() }: { value: string } = $props();

	let inputValue: string = $state(value);
	let debounceTimeout: NodeJS.Timeout | null = $state(null);

	function doUpdate() {
		if (debounceTimeout) clearTimeout(debounceTimeout);

		debounceTimeout = setTimeout(() => {
			value = inputValue;
		}, 250);
	}

	function focusElement(node: HTMLInputElement) {
		node.focus();
	}
</script>

<label class="input w-full">
	<input
		type="text"
		placeholder="Your text"
		bind:value={inputValue}
		oninput={doUpdate}
		use:focusElement
	/>
</label>
