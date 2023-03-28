import { TimelineEventData } from "../src/components/TimelineEvent";
import {
  ClientTimeline,
  defaultTimelineConfig,
  TimelineConfig,
} from "../src/Timeline";
import { getClientTimeline } from "../src/lib/getClientTimeline";
import {
  isOdd,
  randomInt,
  randomName,
  randomDate,
  array,
  randomDateRange,
} from "deverything";

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
  return array(randomInt(1, 100), (_, index) => ({
    id: index,
    name: randomName(),
    city: randomName(),
    ...(isOdd(index) ? { date: randomDate() } : randomDateRange()),
  }));
};
