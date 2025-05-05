<script lang="ts">
	import jsQR from "jsqr";

	let text = "This will be a link!";

	function handlePaste(event: ClipboardEvent) {
		const clipboardData = event.clipboardData;
		if (clipboardData) {
			const pastedData = clipboardData.files[0];

			console.log(pastedData);
			if (pastedData) {
				const image = new Image();

				const reader = new FileReader();
				reader.onload = (e) => {
					image.src = e.target!.result! as string;
				};
				reader.readAsDataURL(pastedData);

				image.onload = () => {
					const canvas = document.createElement("canvas");
					canvas.width = image.width;
					canvas.height = image.height;

					const ctx = canvas.getContext("2d")!;
					ctx.drawImage(image, 0, 0);

					const imageData = ctx.getImageData(
						0,
						0,
						canvas.width,
						canvas.height,
					);
					const rgbaArray = imageData.data; // This is a Uint8ClampedArray of [R, G, B, A, R, G, B, A, ...]

					console.log(rgbaArray); // You now have the RGBA byte array
					readQRCode(rgbaArray, canvas.width, canvas.height);
				};
			}
		}
	}

	function readQRCode(
		bytes: Uint8ClampedArray,
		width: number,
		height: number,
	) {
		const code = jsQR(bytes, width, height, {});

		if (code) {
			console.log(code.data);
			text = code.data;
		} else {
			console.log("No QR code found.");
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
