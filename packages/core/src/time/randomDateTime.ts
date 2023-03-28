import { DateTime } from "luxon";
import { randomDate } from "deverything";

export const randomDateTime = () => {
  return DateTime.fromJSDate(randomDate());
};
