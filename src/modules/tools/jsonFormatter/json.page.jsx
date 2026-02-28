import { jsonFormatterDefaults } from "@/modules/tools/jsonFormatter/json.logic";
import JsonFormatterUI from "@/modules/tools/jsonFormatter/json.ui";

export default function JsonFormatterPage() {
  return <JsonFormatterUI defaults={jsonFormatterDefaults} />;
}
