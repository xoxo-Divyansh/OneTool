export const PDF_STUDIO_LIMITS = {
  maxFiles: 10,
  maxFileSizeBytes: 20 * 1024 * 1024,
};

export const PDF_STUDIO_ACCEPT = {
  pdf: "application/pdf",
  image: "image/*",
};

export const PDF_STUDIO_SUPPORTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
]);

export const PDF_STUDIO_ACCEPT_CONFIG = {
  pdf: {
    "application/pdf": [".pdf"],
  },
  image: {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
  },
};
