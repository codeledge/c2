import { DateTime } from "luxon";
import { randomInt } from "./randomInt";

export const randomDate = (
  start: Date = DateTime.now().minus({ days: 15 }).toJSDate(),
  end: Date = DateTime.now().plus({ days: 15 }).toJSDate()
) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

export const randomDateRange = () => {
  const startDate = randomDate();

  const endDate = randomFutureDate(startDate);

  return {
    endDate,
    startDate,
  };
};

// Add a safe margin in the future (i.e. lagging tests). About 5 minutes is enough.
export const randomFutureDate = (
  start: Date = DateTime.now().plus({ minutes: 5 }).toJSDate(),
  end?: Date
) => {
  return randomDate(start, end);
};

export const randomPastDate = (
  start?: Date,
  end: Date = DateTime.now().minus({ days: 1 }).toJSDate()
) => {
  return randomDate(start, end);
};
