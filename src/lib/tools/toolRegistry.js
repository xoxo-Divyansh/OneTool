export const toolCategories = [
  {
    id: "general",
    label: "General Tools",
    description: "Everyday utilities for files, media, and quick tasks.",
    path: "/tools/general",
    icon: "GN",
  },
  {
    id: "developer",
    label: "Developer Tools",
    description: "Code-focused helpers for faster debugging and formatting.",
    path: "/tools/developer",
    icon: "DE",
  },
  {
    id: "student",
    label: "Student Tools",
    description: "Study and productivity helpers for daily learning workflows.",
    path: "/tools/student",
    icon: "ST",
  },
];

export const tools = [
  {
    name: "Image Compressor",
    slug: "image-compressor",
    category: "general",
    description: "Compress image size using a quality slider and download it.",
    icon: "IM",
    path: "/tools/general/image-compressor",
  },
  {
    name: "PDF Generator",
    slug: "pdf-generator",
    category: "general",
    description: "Create downloadable PDF files from text.",
    icon: "PD",
    path: "/tools/general/pdf-generator",
    comingSoon: true,
  },
  {
    name: "JSON Formatter",
    slug: "json-formatter",
    category: "developer",
    description: "Paste JSON, beautify it, and copy the result.",
    icon: "JS",
    path: "/tools/developer/json-formatter",
  },
  {
    name: "API Tester",
    slug: "api-tester",
    category: "developer",
    description: "Send API requests and inspect response body and headers.",
    icon: "AP",
    path: "/tools/developer/api-tester",
  },
  {
    name: "Study Timer",
    slug: "study-timer",
    category: "student",
    description: "Track focused study sessions with simple timing.",
    icon: "TM",
    path: "/tools/student/study-timer",
    comingSoon: true,
  },
];

export function getCategoryById(categoryId) {
  return toolCategories.find((category) => category.id === categoryId);
}

export function getToolsByCategory(categoryId) {
  return tools.filter((tool) => tool.category === categoryId);
}
