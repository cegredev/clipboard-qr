import { htmlImageToByteArray, readQRCode } from "./qr";

export const tryReadQRCodeUrlFromClipboard = async (
	file: File,
): Promise<string | undefined> => {
	const image = await extractImageFromFile(file);
	if (!image) return;

	const byteArray = htmlImageToByteArray(image);

	const qrCode = readQRCode(byteArray, image.width, image.height);
	if (!qrCode) return;

	return qrCode.data;
};

const extractImageFromFile = async (
	imageSrc: Blob,
): Promise<HTMLImageElement | null> => {
	const image = new Image();

	const reader = new FileReader();
	reader.onload = (e) => {
		image.src = e.target!.result! as string;
	};
	reader.readAsDataURL(imageSrc);

	return new Promise((resolve, reject) => {
		image.onload = () => resolve(image);
	});
};
