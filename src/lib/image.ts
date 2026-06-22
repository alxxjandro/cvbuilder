/**
 * Reads an image file, downscales it so its longest edge is at most `maxEdge`
 * pixels, and returns a compressed JPEG data URL. Keeping the headshot small
 * means it can live inline in the document JSON without bloating the row or
 * needing object storage.
 *
 * @param file - The user-selected image file.
 * @param maxEdge - Maximum width/height of the result, in pixels.
 * @param quality - JPEG quality between 0 and 1.
 * @returns A base64 `image/jpeg` data URL.
 */
export async function resizeImageToDataUrl(
  file: File,
  maxEdge = 400,
  quality = 0.85,
): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Could not get a 2D drawing context for image resizing.");
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return canvas.toDataURL("image/jpeg", quality);
}
