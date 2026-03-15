import JsonFormatterToolPage from "@/tools/json-formatter/page";
import { run } from "@/tools/json-formatter/run";

export const metadata = {
  id: "json-formatter",
  name: "JSON Formatter",
  category: "developer",
  description: "Format, minify, and validate JSON instantly.",
  icon: "JS",
  comingSoon: false,
  requiresAuth: false,
};

const jsonFormatterToolConfig = {
  ...metadata,
  component: JsonFormatterToolPage,
  run,
};

export default jsonFormatterToolConfig;
