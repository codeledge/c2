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
          const dateTime = parseDateTime(event.date);
          const startDateTime = parseDateTime(event.startDate);
          const endDateTime = parseDateTime(event.endDate);

          if (!startDateTime && !dateTime && !endDateTime) return events;

          if (!minDateTime) {
            minDateTime = startDateTime || dateTime || endDateTime;
          }
          if (!maxDateTime) {
            maxDateTime = endDateTime || dateTime || startDateTime;
          }

          if (dateTime && dateTime < minDateTime!) {
            minDateTime = dateTime;
          }
          if (startDateTime && startDateTime < minDateTime!) {
            minDateTime = startDateTime;
          }
          if (endDateTime && endDateTime < minDateTime!) {
            minDateTime = endDateTime;
          }
          if (dateTime && dateTime > maxDateTime!) {
            maxDateTime = dateTime;
          }
          if (startDateTime && startDateTime > maxDateTime!) {
            maxDateTime = startDateTime;
          }
          if (endDateTime && endDateTime > maxDateTime!) {
            maxDateTime = endDateTime;
          }

          return events.concat({
            ...event,
            y:
              rowIndex * timelineConfig.rowHeight +
              timelineConfig.rowHeight / 2,
            dateTime,
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

  const eventsDurationMilliseconds = maxDateTime!
    .diff(minDateTime!)
    .as("milliseconds");

  const minDateEdge = minDateTime!.minus({
    milliseconds: eventsDurationMilliseconds / 10,
  });
  const maxDateEdge = maxDateTime!.plus({
    milliseconds: eventsDurationMilliseconds / 10,
  });

  const gridDurationMilliseconds = maxDateEdge!
    .diff(minDateEdge!)
    .as("milliseconds");

  clientEvents = clientEvents.map((event) => {
    return {
      ...event,
      x: getX(
        event.dateTime || event.startDateTime || event.endDateTime!,
        minDateEdge,
        gridDurationMilliseconds,
        timelineConfig
      ),
      startX: event.startDateTime
        ? getX(
            event.startDateTime,
            minDateEdge,
            gridDurationMilliseconds,
            timelineConfig
          )
        : undefined,
      endX: event.endDateTime
        ? getX(
            event.endDateTime,
            minDateEdge,
            gridDurationMilliseconds,
            timelineConfig
          )
        : undefined,
    };
  });

  const tickStepMilliseconds =
    gridDurationMilliseconds / timelineConfig.tickDensity;

  const ticks = Array.from(
    { length: timelineConfig.tickDensity + 1 },
    (_, i) => {
      const x = (i / 10) * timelineConfig.gridWidth;
      return {
        x,
        label: minDateEdge
          .plus({ milliseconds: tickStepMilliseconds * i })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
      };
    }
  );

  return {
    clientEvents,
    eventsDurationMilliseconds,
    gridDurationMilliseconds,
    maxDateEdge,
    maxDateTime,
    minDateEdge,
    minDateTime,
    ticks,
  };
};

const getX = (
  dateTime: DateTime,
  minDateEdge: DateTime,
  gridDurationMilliseconds: number,
  timelineConfig: TimelineConfig
) => {
  return (
    (dateTime.diff(minDateEdge).as("milliseconds") / gridDurationMilliseconds) *
    timelineConfig.gridWidth
  );
};
