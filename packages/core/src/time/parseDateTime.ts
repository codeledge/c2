import { DateTime, DateTimeOptions } from "luxon";

export const parseDateTime = (
  date?: string | Date,
  options?: { withTimeZone?: boolean }
) => {
  if (!date) return undefined;

  const config: DateTimeOptions = {};
  //Selecting this flag will set the timezone from the browser instead of UTC
  if (options?.withTimeZone) {
    config.zone = DateTime.local().zoneName;
  }
  return date instanceof Date
    ? DateTime.fromJSDate(date)
    : DateTime.fromISO(date, config);
};
