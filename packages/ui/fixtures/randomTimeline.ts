import {
  ClientTimeline,
  defaultTimelineConfig,
  TimelineConfig,
  TimelineRow,
} from "../src/layouts/Timeline";
import { getClientTimeline } from "../src/lib/getClientTimeline";
import { isOdd } from "../src/lib/isOdd";
import { randomArrayItem } from "./randomArrayItem";
import { randomDate, randomDateRange } from "./randomDate";
import { randomInt } from "./randomInt";
import { randomName } from "./randomName";

export const randomTimelineConfig = (
  values: Partial<TimelineConfig> = {}
): TimelineConfig => {
  return {
    ...defaultTimelineConfig,
    ...values,
  };
};

export const randomClientTimeline = (
  values: Partial<TimelineConfig> = {},
  data: TimelineRow[] = []
): ClientTimeline => {
  return getClientTimeline(randomTimelineConfig(values), data);
};

export const randomTimelineData = (): TimelineRow[] => {
  return Array.from({ length: randomInt() }, (_, index) => ({
    id: index,
    name: randomName(),
    events: Array.from({ length: randomInt(1, 10) }, (_, index) => ({
      id: index,
      name: randomName(),
      ...(isOdd(index) ? { date: randomDate() } : randomDateRange()),
    })),
  }));
};
