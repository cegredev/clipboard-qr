<script lang="ts">
	import { tryReadQRCodeUrlFromClipboard } from "./lib/clipboard";
	import { generateQRCode } from "./lib/qr";
	import type { Output } from "./lib/types";

	let output: Output = {
		type: "text",
		data: "This will be a link!",
	};

	async function handlePaste(event: ClipboardEvent) {
		const clipboardData = event.clipboardData;
		if (!clipboardData) return;

		console.log(clipboardData.types);

		if (clipboardData.types.includes("Files")) {
			const text = await tryReadQRCodeUrlFromClipboard(clipboardData);
			if (!text) return;

			output = {
				type: "text",
				data: text,
			};
		}

		if (clipboardData.types.includes("text/plain")) {
			const text = clipboardData.getData("text/plain");
			const qrCode = await generateQRCode(text);
			output = {
				type: "qrcode",
				data: qrCode,
			};
		}
	}
</script>

<main on:paste={handlePaste}>
	{#if output.type === "text"}
		<p>{output.data}</p>
	{:else if output.type === "qrcode"}
		<img src={output.data} alt="QR Code" />
	{/if}
</main>

<style>
	main {
		width: 100%;
		height: 100%;
	}
</style>
