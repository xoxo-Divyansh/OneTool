import StudyTimerToolPage from "@/tools/study-timer/page";

export const metadata = {
  id: "study-timer",
  name: "Study Timer",
  category: "student",
  description: "Stay focused with guided study sessions",
  route: "/tools/study-timer",
  icon: "ST",
  comingSoon: false,
  requiresAuth: false,
  keywords: ["study", "timer", "pomodoro", "focus", "break", "sessions"],
};

const studyTimerToolConfig = {
  ...metadata,
  component: StudyTimerToolPage,
};

export default studyTimerToolConfig;
