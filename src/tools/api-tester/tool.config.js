import ApiTesterToolPage from "@/tools/api-tester/page";
import { run } from "@/tools/api-tester/run";

const apiTesterToolConfig = {
  id: "api-tester",
  name: "API Tester",
  category: "developer",
  description: "Send API requests and inspect response body and headers.",
  icon: "AP",
  comingSoon: false,
  component: ApiTesterToolPage,
  run,
};

export default apiTesterToolConfig;
