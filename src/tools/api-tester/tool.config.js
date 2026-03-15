import ApiTesterToolPage from "@/tools/api-tester/page";
import { run } from "@/tools/api-tester/run";

export const metadata = {
  id: "api-tester",
  name: "API Tester",
  category: "developer",
  description: "Send API requests and inspect response body and headers.",
  icon: "AP",
  comingSoon: false,
  requiresAuth: true,
};

const apiTesterToolConfig = {
  ...metadata,
  component: ApiTesterToolPage,
  run,
};

export default apiTesterToolConfig;
