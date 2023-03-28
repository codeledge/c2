import { DateTime } from "luxon";
import { DateLike, parseDate } from "deverything";

export const parseDateTime = (date?: DateLike) => {
  const parsedDate = parseDate(date);
  if (!parsedDate) return undefined;

  return DateTime.fromJSDate(parsedDate);
};
