<script lang="ts">
	import { tryReadQRCodeUrlFromClipboard } from "./lib/clipboard";

	let text = "This will be a link!";

	async function handlePaste(event: ClipboardEvent) {
		const clipboardData = event.clipboardData;
		if (!clipboardData) return;

		if (clipboardData.types.includes("Files")) {
			const url = await tryReadQRCodeUrlFromClipboard(clipboardData);
			if (!url) return;

			text = url;
		}
	}
</script>

<main on:paste={handlePaste}>
	<p>{text}</p>
</main>

<style>
	main {
		width: 100%;
		height: 100%;
	}
</style>
