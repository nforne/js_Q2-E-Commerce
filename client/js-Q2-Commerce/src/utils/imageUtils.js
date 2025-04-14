// ../utils/imageUtils.js

/**
 * Compress an image file to reduce size while maintaining quality.
 * @param {File} file - Image file to be compressed.
 * @param {number} quality - Compression quality (0 to 1).
 * @returns {Promise<File>} - Compressed image file.
 */
export const compressImage = async (file, quality = 0.8) => {
  const image = new Image();
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      image.src = event.target.result;
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;

        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: file.type }));
            } else {
              reject(new Error("Compression failed."));
            }
          },
          file.type,
          quality
        );
      };
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
};

/**
 * Resize an image to the specified dimensions.
 * @param {File} file - Image file to be resized.
 * @param {number} width - Desired width.
 * @param {number} height - Desired height.
 * @returns {Promise<File>} - Resized image file.
 */
export const resizeImage = async (file, width, height) => {
  const image = new Image();
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      image.src = event.target.result;
      image.onload = () => {
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(image, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: file.type }));
            } else {
              reject(new Error("Resizing failed."));
            }
          },
          file.type
        );
      };
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
};

/**
 * Convert an image file to a Base64 string.
 * @param {File} file - Image file to be converted.
 * @returns {Promise<string>} - Base64 encoded string.
 */
export const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to convert to Base64."));
    reader.readAsDataURL(file);
  });
};
