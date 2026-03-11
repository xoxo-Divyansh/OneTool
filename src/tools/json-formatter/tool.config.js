import JsonFormatterToolPage from "@/tools/json-formatter/page";
import { run } from "@/tools/json-formatter/run";

export const metadata = {
  id: "json-formatter",
  name: "JSON Formatter",
  category: "developer",
  description: "Paste JSON, beautify it, and copy the result.",
  icon: "JS",
  comingSoon: false,
};

const jsonFormatterToolConfig = {
  ...metadata,
  component: JsonFormatterToolPage,
  run,
};

export default jsonFormatterToolConfig;
