/**
 * signatureUtils.ts
 * Utilities for client-side signature image processing (e.g., background removal)
 */

/**
 * Removes the light/white background from an image (uploaded signature)
 * and returns a transparent PNG base64 string.
 * Uses canvas pixel manipulation.
 */
export function removeSignatureBackground(
  imageSource: File | string,
  threshold: number = 190
): Promise<string> {
  return new Promise((resolve, reject) => {
    const handleDataUrl = (dataUrl: string) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            return reject(new Error("Could not create canvas 2d context"));
          }

          // Set canvas dimensions
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;

          // Draw image
          ctx.drawImage(img, 0, 0);

          // Get image data
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const alpha = data[i + 3];

            // If it's already transparent, keep it transparent
            if (alpha < 10) {
              data[i + 3] = 0;
              continue;
            }

            // Calculate luminance (perceptual brightness)
            const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

            if (brightness >= threshold) {
              // Convert light/white background to completely transparent
              data[i + 3] = 0;
            } else {
              // Smooth out edges for a clean anti-aliased ink stroke.
              // As brightness approaches the threshold, increase transparency.
              const maxBrightness = threshold;
              const alphaFactor = (maxBrightness - brightness) / maxBrightness;
              
              // Apply smooth alpha mapping, respecting the original alpha
              const targetAlpha = Math.round(Math.min(255, Math.max(0, alphaFactor * 255 * 1.5)));
              data[i + 3] = Math.min(alpha, targetAlpha);
              
              // Set the color to a clean, uniform white pen stroke
              data[i] = 255;
              data[i + 1] = 255;
              data[i + 2] = 255;
            }
          }

          // Write pixels back
          ctx.putImageData(imgData, 0, 0);

          // Export transparent PNG
          resolve(canvas.toDataURL("image/png"));
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = (err) => reject(err);
      img.src = dataUrl;
    };

    if (imageSource instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === "string") {
          handleDataUrl(e.target.result);
        } else {
          reject(new Error("Failed to read file as data URL"));
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(imageSource);
    } else if (typeof imageSource === "string") {
      handleDataUrl(imageSource);
    } else {
      reject(new Error("Invalid image source provided"));
    }
  });
}
