import jsQR, { type QRCode } from "jsqr";
import QRCodeGen from "qrcode";
import type { QrOptions } from "./types";

export const QR_SIZES = [128, 256, 512, 768, 1024, 1536, 2048] as const;

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

export const dataUrlToFile = async (url: string): Promise<File> => {
	const blob = await fetch(url).then((res) => res.blob());
	const file = new File([blob], "qrcode.png", { type: "image/png" });

	return file;
};

export const readQRCode = (
	bytes: Uint8ClampedArray,
	width: number,
	height: number,
): QRCode | null =>
	jsQR(bytes, width, height, {
		inversionAttempts: "attemptBoth",
	});

export const generateQRCode = (
	text: string,
	options: QrOptions,
): Promise<string> => {
	return new Promise((resolve, reject) => {
		QRCodeGen.toDataURL(
			text,
			{
				width: options.size,
			},
			(error, url) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(url);
			},
		);
	});
};
