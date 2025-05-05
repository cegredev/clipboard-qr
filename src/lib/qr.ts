import jsQR, { type QRCode } from "jsqr";

export const htmlImageToByteArray = (
	image: HTMLImageElement,
): Uint8ClampedArray => {
	const canvas = document.createElement("canvas");
	canvas.width = image.width;
	canvas.height = image.height;

	const ctx = canvas.getContext("2d")!;
	ctx.drawImage(image, 0, 0);

	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const rgbaArray = imageData.data;

	return rgbaArray;
};

export const readQRCode = (
	bytes: Uint8ClampedArray,
	width: number,
	height: number,
): QRCode | null =>
	jsQR(bytes, width, height, {
		inversionAttempts: "attemptBoth",
	});
