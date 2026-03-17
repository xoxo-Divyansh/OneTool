"use client";

import { studyTimerDefaults } from "@/modules/tools/studyTimer/studyTimer.logic";
import StudyTimerUI from "@/modules/tools/studyTimer/studyTimer.ui";

export default function StudyTimerPage() {
  return <StudyTimerUI defaults={studyTimerDefaults} />;
}
