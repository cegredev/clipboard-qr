<script lang="ts">
	import { tryReadQRCodeUrlFromClipboard } from "./lib/clipboard";
	import { dataUrlToFile, generateQRCode, QR_SIZES } from "./lib/qr";
	import QrTextInput from "./lib/QrTextInput.svelte";
	import type { QrOptions } from "./lib/types";

	const searchParams = new URLSearchParams(window.location.search);
	const DEFAULT_QR_SIZE: (typeof QR_SIZES)[number] = 512;

	let qrText: string = searchParams.get("text") ?? "";
	let qrOptions: QrOptions = {
		size: DEFAULT_QR_SIZE,
	};
	let qrCustomSize: boolean = false;
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

	async function handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files || input.files.length === 0) return;

		const file = input.files[0];
		await handleImageUpdate(file);
	}

	async function handleQrPaste() {
		const items = await navigator.clipboard.read();

		for (const item of items) {
			const type = item.types.find((type) => type.startsWith("image/"));
			if (!type) continue;

			const file = await item.getType(type);
			if (!file) continue;

			await handleImageUpdate(new File([file], "qr.png"));
			break;
		}
	}
</script>

<main on:paste={handlePaste}>
	<div class="gap-8 grid grid-cols-1 2xl:grid-cols-2">
		<div class="flex flex-col items-center gap-4 m-4 2xl:order-2">
			{#if qrImage}
				<img src={qrImage} width={DEFAULT_QR_SIZE} alt="QR Code" />
			{/if}
			<div class="flex flex-row justify-center gap-4">
				<input
					type="file"
					class="file-input"
					on:change={handleFileUpload}
				/>
				<button class="btn" on:click={handleQrPaste}>Paste</button>
			</div>
		</div>

		<div
			class="flex flex-col justify-center items-center gap-4 m-4 2xl:order-1"
		>
			<QrTextInput bind:value={qrText} />

			<div class="join">
				{#each QR_SIZES as size}
					<input
						class="join-item btn"
						type="radio"
						name="size"
						aria-label={`${size}px`}
						checked={size === DEFAULT_QR_SIZE}
						on:click={() => {
							qrOptions.size = size;
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
					<input type="number" bind:value={qrOptions.size} />
				</label>
			{/if}

			<div class="join">
				<button class="btn" on:click={() => handleCopy("text")}>
					Copy text
				</button>
				<button class="btn" on:click={() => handleCopy("image")}>
					Copy QR-Code
				</button>
			</div>
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
