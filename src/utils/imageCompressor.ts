/**
 * Utility untuk kompresi gambar di sisi browser sebelum disimpan ke database/storage.
 * Mengubah gambar besar (misal 3-5MB dari kamera/laptop) menjadi WebP ringan (<80KB)
 * dengan resolusi optimal, sehingga menghemat kuota database & mempercepat loading.
 */
export interface CompressedImageResult {
  dataUrl: string;
  sizeKb: number;
  width: number;
  height: number;
}

export async function compressImage(
  file: File,
  maxWidth = 800,
  quality = 0.82
): Promise<CompressedImageResult> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File yang dipilih bukan gambar yang valid.'));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Proporsional resize jika melebihi maxWidth
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context tidak tersedia'));
          return;
        }

        // Gambar ke canvas dengan smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Ekspor sebagai webp (jika didukung) atau jpeg
        let dataUrl = canvas.toDataURL('image/webp', quality);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        // Hitung estimasi ukuran dalam KB
        const base64Length = dataUrl.length - (dataUrl.indexOf(',') + 1);
        const sizeKb = Math.round((base64Length * 0.75) / 1024);

        resolve({ dataUrl, sizeKb, width, height });
      };

      img.onerror = (err) => reject(new Error('Gagal memuat gambar: ' + err));
    };

    reader.onerror = (err) => reject(new Error('Gagal membaca file: ' + err));
  });
}
