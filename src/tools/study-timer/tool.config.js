import StudyTimerToolPage from "@/tools/study-timer/page";

export const metadata = {
  id: "study-timer",
  name: "Study Timer",
  category: "student",
  description: "Track focused study sessions with simple timing.",
  icon: "TM",
  comingSoon: true,
};

const studyTimerToolConfig = {
  ...metadata,
  component: StudyTimerToolPage,
};

export default studyTimerToolConfig;
