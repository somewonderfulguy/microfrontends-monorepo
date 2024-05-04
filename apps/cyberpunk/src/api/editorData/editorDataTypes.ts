export type MediaType = 'video' | 'audio';

export type TimelineRow = {
  options: unknown;
  id: string;
  fragments: TimelineFragment[];
  type: MediaType;
};

export type TimelineFragment = {
  options: unknown;
  id: string;
  src: string;
  name: string;
  start: number;
  duration: number;
  thumbnail?: string;
};

export type VideoEditor = {
  options: unknown;
  timeline: TimelineRow[];
};
