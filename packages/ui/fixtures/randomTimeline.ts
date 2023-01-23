import { TimelineEventData } from "../src/components/TimelineEvent";
import {
  ClientTimeline,
  defaultTimelineConfig,
  TimelineConfig,
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
  data: TimelineEventData[] = []
): ClientTimeline => {
  return getClientTimeline(randomTimelineConfig(values), data, 1000, 1000);
};

export const randomTimelineData = (): TimelineEventData[] => {
  return Array.from({ length: randomInt(1, 10) }, (_, index) => ({
    id: index,
    name: randomName(),
    city: randomName(),
    ...(isOdd(index) ? { date: randomDate() } : randomDateRange()),
  }));
};
