import ImageCompressorToolPage from "@/tools/image-compressor/page";

export const metadata = {
  id: "image-compressor",
  name: "Image Compressor",
  category: "general",
  description: "Compress image size using a quality slider and download it.",
  icon: "IM",
  comingSoon: false,
};

const imageCompressorToolConfig = {
  ...metadata,
  component: ImageCompressorToolPage,
};

export default imageCompressorToolConfig;
