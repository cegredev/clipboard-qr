<script lang="ts">
	import { tryReadQRCodeUrlFromClipboard } from "./lib/clipboard";
	import { dataUrlToFile, generateQRCode, QR_SIZES } from "./lib/qr";
	import type { QrOptions } from "./lib/types";

	const DEFAULT_QR_SIZE: (typeof QR_SIZES)[number] = 512;

	let qrText: string = "f";
	let qrOptions: QrOptions = {
		size: DEFAULT_QR_SIZE,
	};
	let qrImage: string | null = null;

	$: (qrText || qrOptions) && handleTextUpdate();

	async function handleTextUpdate() {
		if (qrText === "") {
			qrImage = null;
			return;
		}

		const qrCode = await generateQRCode(qrText, qrOptions);
		qrImage = qrCode;
	}

	async function handleImageUpdate(image: File) {
		const text = await tryReadQRCodeUrlFromClipboard(image);
		if (!text) return;

		qrText = text;
	}

	async function handlePaste(event: ClipboardEvent) {
		const clipboardData = event.clipboardData;
		if (!clipboardData) return;

		if (clipboardData.types.includes("Files")) {
			if (clipboardData.files.length === 0) return;

			const file = clipboardData.files[0];
			if (!file) return;

			await handleImageUpdate(file);
		}

		if (clipboardData.types.includes("text/plain")) {
			const text = clipboardData.getData("text/plain");

			qrText = text;
			await handleTextUpdate();
		}
	}

	async function handleCopy(type: "text" | "image") {
		if (type === "text") {
			await navigator.clipboard.writeText(qrText);
		}

		if (type === "image") {
			if (!qrImage) return;

			const file = await dataUrlToFile(qrImage);

			await navigator.clipboard.write([
				new ClipboardItem({
					"image/png": file,
				}),
			]);
		}
	}
</script>

<main on:paste={handlePaste}>
	<div class="grid grid-cols-2 gap-4">
		<div class="flex flex-col justify-center items-center gap-4">
			<input
				type="text"
				placeholder="Your text"
				class="input w-full"
				bind:value={qrText}
			/>

			<div class="join">
				{#each QR_SIZES as size}
					<input
						class="join-item btn"
						type="radio"
						name="size"
						aria-label={`${size}px`}
						checked={size === 512}
						on:click={() => (qrOptions.size = size)}
					/>
				{/each}
			</div>

			<div class="join">
				<button class="btn" on:click={() => handleCopy("text")}>
					Copy text
				</button>
				<button class="btn" on:click={() => handleCopy("image")}>
					Copy QR-Code
				</button>
			</div>
		</div>
		<div>
			<img src={qrImage} width={512} alt="QR Code" />
		</div>
	</div>
</main>

<style>
	main {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	img {
		image-rendering: crisp-edges;
	}
</style>
