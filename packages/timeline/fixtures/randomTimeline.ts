import { TimelineEventData } from "../src/components/TimelineEvent";
import { defaultTimelineConfig } from "../src/Timeline";
import { getClientTimeline } from "../src/lib/getClientTimeline";
import {
  isOdd,
  randomInt,
  randomName,
  randomDate,
  array,
  randomDateRange,
} from "deverything";
import { TimelineConfig } from "../src/types/TimelineConfig";
import { ClientTimeline } from "../src/types/ClientTimeline";

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
  return getClientTimeline(randomTimelineConfig(values), data);
};

export const randomTimelineData = (): TimelineEventData[] => {
  return array(randomInt(1, 100), (_, index) => ({
    id: index,
    name: randomName(),
    city: randomName(),
    ...(isOdd(index) ? { date: randomDate() } : randomDateRange()),
  }));
};
