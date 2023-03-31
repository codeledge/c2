import { DateTime } from "luxon";
import { randomDate } from "deverything";

export const randomDateTime = (start?: Date, end?: Date) => {
  return DateTime.fromJSDate(randomDate(start, end));
};
