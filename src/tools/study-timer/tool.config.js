import StudyTimerToolPage from "@/tools/study-timer/page";

export const metadata = {
  id: "study-timer",
  name: "Study Timer",
  category: "student",
  description: "Track focus sessions with a clean study timer.",
  icon: "ST",
  comingSoon: true,
  requiresAuth: false,
};

const studyTimerToolConfig = {
  ...metadata,
  component: StudyTimerToolPage,
};

export default studyTimerToolConfig;
