import type { QR_SIZES } from "./qr";

export type QrOptions = {
	size: (typeof QR_SIZES)[number];
};
