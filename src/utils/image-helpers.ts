export const imageHelpers = {
  base64ToBlob: (base64Data: string, type = "image/png"): Blob => {
    const byteString = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([uint8Array], { type });
  },

  generateImageFileName: (prefix: string): string => {
    const uniqueId = Math.random().toString(36).substring(2, 8);
    return `${prefix}-${uniqueId}`.replace(/[^a-z0-9-]/gi, "");
  },

  shareOrDownload: async (
    imageData: string,
    prefix: string
  ): Promise<void> => {
    const fileName = imageHelpers.generateImageFileName(prefix);

    // Extrahiere den Base64-Teil aus dem Data URL
    const matches = imageData.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) {
      throw new Error("Ungültiges Image Data URL");
    }
    const mimeType = matches[1];
    const base64Data = matches[2];

    const blob = imageHelpers.base64ToBlob(base64Data, mimeType);
    const file = new File([blob], `${fileName}.png`, { type: mimeType });

    try {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: `Image generated AI`,
        });
      } else {
        throw new Error("Share API not available");
      }
    } catch (error) {
      // Fall back to download for any error (including share cancellation)
      console.error("Error sharing/downloading:", error);
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${fileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    }
  }
};