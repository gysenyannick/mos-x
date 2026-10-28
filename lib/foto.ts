/** Verkleint een foto in de browser (max. 1800 px, JPEG) zodat uploaden snel gaat. */
export async function comprimeer(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const schaal = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * schaal);
    canvas.height = Math.round(bitmap.height * schaal);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.82));
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file; // bv. HEIC in een browser die het niet kan lezen: origineel sturen
  }
}

/** Haalt de meegestuurde foto's (foto_0, foto_1, ...) uit een formulier, klaar als mailbijlage. */
export async function fotoBijlagen(data: FormData, max = 3): Promise<{ filename: string; content: string }[]> {
  const bijlagen: { filename: string; content: string }[] = [];
  for (let i = 0; i < max; i++) {
    const file = data.get(`foto_${i}`);
    if (!(file instanceof File) || file.size === 0 || file.size > 4_000_000) continue;
    if (file.type && !file.type.startsWith("image/")) continue;
    const buf = Buffer.from(await file.arrayBuffer());
    bijlagen.push({ filename: file.name || `foto-${i + 1}.jpg`, content: buf.toString("base64") });
  }
  return bijlagen;
}
