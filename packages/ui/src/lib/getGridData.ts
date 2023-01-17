import { DateTime, DateTimeOptions } from "luxon";
import { parseDateTime } from "shapes";
import {
  ClientTimelineEvent,
  TimelineEventData,
} from "../components/TimelineEvent";
import { TimelineConfig, TimelineRow } from "../layouts/Timeline";

export const getGridData = (
  rows: TimelineRow[],
  timelineConfig: TimelineConfig
) => {
  let minDateTime: DateTime | undefined;
  let maxDateTime: DateTime | undefined;

  let clientEvents = rows.reduce(
    (events: ClientTimelineEvent[], row, rowIndex) => {
      const rowEvents = row.events.reduce(
        (events: ClientTimelineEvent[], event) => {
          if (!event.date && !(event.startDate && event.endDate)) {
            console.log("skipped event", event);
            return events;
          }

          let dateTime = parseDateTime(event.date);
          const startDateTime = parseDateTime(event.startDate);
          const endDateTime = parseDateTime(event.endDate);

          if (!dateTime && startDateTime && endDateTime) {
            dateTime = endDateTime.minus({
              milliseconds:
                endDateTime.diff(startDateTime).as("milliseconds") / 2,
            });
          }
          if (!dateTime && !startDateTime && endDateTime) {
            dateTime = startDateTime;
          }

          if (!minDateTime) {
            minDateTime = startDateTime || dateTime;
          }
          if (!maxDateTime) {
            maxDateTime = dateTime || endDateTime;
          }

          if (dateTime && dateTime < minDateTime!) {
            minDateTime = dateTime;
          }
          if (startDateTime && startDateTime < minDateTime!) {
            minDateTime = startDateTime;
          }

          if (dateTime && dateTime > maxDateTime!) {
            maxDateTime = dateTime;
          }

          if (endDateTime && endDateTime > maxDateTime!) {
            maxDateTime = endDateTime;
          }

          return events.concat({
            ...event,
            x: -1, // since required
            y:
              rowIndex * timelineConfig.rowHeight +
              timelineConfig.rowHeight / 2,
            dateTime: dateTime!,
            startDateTime,
            endDateTime,
          });
        },
        []
      );

      return events.concat(rowEvents);
    },
    []
  );

  // todo throw error on no { minDateTime, maxDateTime }

  console.log({ minDateTime, maxDateTime });

  const eventsDurationMilliseconds =
    maxDateTime!.diff(minDateTime!).as("milliseconds") || 10000000; //if only one event, make it something, what though?

  const gridStartDateTime = minDateTime!.minus({
    milliseconds: eventsDurationMilliseconds / 10,
  });
  const gridEndDateTime = maxDateTime!.plus({
    milliseconds: eventsDurationMilliseconds / 10,
  });

  const gridDurationMilliseconds = gridEndDateTime!
    .diff(gridStartDateTime!)
    .as("milliseconds");

  console.log({ gridStartDateTime, gridEndDateTime, gridDurationMilliseconds });

  clientEvents = clientEvents.map((event) => {
    return {
      ...event,
      x: getX(
        event.dateTime,
        gridStartDateTime,
        gridDurationMilliseconds,
        timelineConfig
      ),
      startX: event.startDateTime
        ? getX(
            event.startDateTime,
            gridStartDateTime,
            gridDurationMilliseconds,
            timelineConfig
          )
        : undefined,
      endX: event.endDateTime
        ? getX(
            event.endDateTime,
            gridStartDateTime,
            gridDurationMilliseconds,
            timelineConfig
          )
        : undefined,
    };
  });

  console.log("clientEvents", clientEvents);

  const tickStepMilliseconds =
    gridDurationMilliseconds / timelineConfig.tickDensity;

  const ticks = Array.from(
    { length: timelineConfig.tickDensity + 1 },
    (_, i) => {
      const x = (i / 10) * timelineConfig.gridWidth;
      return {
        x,
        label: gridStartDateTime
          .plus({ milliseconds: tickStepMilliseconds * i })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
      };
    }
  );

  return {
    clientEvents,
    eventsDurationMilliseconds,
    gridDurationMilliseconds,
    gridEndDateTime,
    maxDateTime,
    gridStartDateTime,
    minDateTime,
    ticks,
  };
};

const getX = (
  dateTime: DateTime,
  gridStartDateTime: DateTime,
  gridDurationMilliseconds: number,
  timelineConfig: TimelineConfig
) => {
  return (
    (dateTime.diff(gridStartDateTime).as("milliseconds") /
      gridDurationMilliseconds) *
    timelineConfig.gridWidth
  );
};
