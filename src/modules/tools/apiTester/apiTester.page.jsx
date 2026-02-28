import { apiTesterDefaults } from "@/modules/tools/apiTester/apiTester.logic";
import ApiTesterUI from "@/modules/tools/apiTester/apiTester.ui";

export default function ApiTesterPage() {
  return <ApiTesterUI defaults={apiTesterDefaults} />;
}
