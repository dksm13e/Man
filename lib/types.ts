export type ScheduleItem = {
  day: string;
  time: string;
  program: string;
  trainer: string;
  hall: string;
  comment?: string;
};

export type ProgramItem = {
  name: string;
  description: string;
};

export type ProgramCategory = {
  id: string;
  title: string;
  items: ProgramItem[];
};
