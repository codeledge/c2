import {
  ClientTimeline,
  defaultTimelineConfig,
  TimelineConfig,
} from "../src/layouts/Timeline";
import { getClientTimeline } from "../src/lib/getClientTimeline";

export const randomTimelineConfig = (
  values: Partial<TimelineConfig> = {}
): TimelineConfig => {
  return {
    ...defaultTimelineConfig,
    ...values,
  };
};

export const randomClientTimeline = (
  values: Partial<TimelineConfig> = {}
): ClientTimeline => {
  return getClientTimeline(randomTimelineConfig(values), []);
};
