import { tools } from "@/modules/dashboard/dashboard.logic";
import DashboardUI from "@/modules/dashboard/dashboard.ui";

export default function DashboardPage() {
  return <DashboardUI tools={tools} />;
}
