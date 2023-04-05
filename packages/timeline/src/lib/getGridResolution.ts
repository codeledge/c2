import { DurationLikeObject, Duration } from "luxon";

export const getGridResolution = (
  rangeMs: number,
  gridWith: number,
  minTickStepWidth: number
): DurationLikeObject => {
  const maxTicks = Math.floor(gridWith / minTickStepWidth);

  const resolutionMs = Math.floor(rangeMs / maxTicks);

  const duration = Duration.fromMillis(resolutionMs);

  if (duration.as("year") >= 1) {
    return { year: Math.floor(duration.as("year")) };
  } else if (duration.as("month") >= 1) {
    return { month: Math.floor(duration.as("month")) };
  } else if (duration.as("day") >= 1) {
    return { day: Math.floor(duration.as("day")) };
  } else if (duration.as("hour") >= 1) {
    return { hour: Math.floor(duration.as("hour")) };
  } else if (duration.as("minute") >= 1) {
    return { minute: Math.floor(duration.as("minute")) };
  } else if (duration.as("second") >= 1) {
    return { second: Math.floor(duration.as("second")) };
  } else {
    return { millisecond: Math.floor(duration.as("millisecond")) };
  }
};
