<script lang="ts">
	export let value: string = "";
	let inputValue: string = value;
	let debounceTimeout: NodeJS.Timeout | null = null;

	$: if (inputValue !== value) {
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
	Text
	<input
		type="text"
		placeholder="Your text"
		bind:value={inputValue}
		use:focusElement
	/>
</label>
