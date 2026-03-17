import dynamic from "next/dynamic";
import { studyTimerDefaults } from "@/modules/tools/studyTimer/studyTimer.logic";

const StudyTimerUI = dynamic(() => import("@/modules/tools/studyTimer/studyTimer.ui"), {
  ssr: false,
});

export default function StudyTimerPage() {
  return <StudyTimerUI defaults={studyTimerDefaults} />;
}
