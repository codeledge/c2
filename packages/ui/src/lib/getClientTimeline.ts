import { DateTime } from "luxon";
import {
  parseDateTime,
  MILLISECONDS_IN_DECADE,
  MILLISECONDS_IN_YEAR,
  MILLISECONDS_IN_MONTH,
} from "shapes";
import {
  ClientTimelineEvent,
  TimelineEventData,
} from "../components/TimelineEvent";
import { TimelineConfig, ClientTimeline } from "../layouts/Timeline";

export const getClientTimeline = (
  timelineConfig: TimelineConfig,
  events: TimelineEventData[],
  containerWidth: number,
  containerHeight: number
): ClientTimeline => {
  const gridWidth =
    (containerWidth - timelineConfig.rowDrawerWidth) * timelineConfig.gridZoom;

  let minDateTime: DateTime | undefined;
  let maxDateTime: DateTime | undefined;

  const groupMap: Record<string, { name: string; index: number }> = {};

  let clientEvents = events.reduce((events: ClientTimelineEvent[], event) => {
    if (!event.date && !(event.startDate && event.endDate)) {
      console.log("skipped event", event);
      return events;
    }

    let dateTime = parseDateTime(event.date);
    const startDateTime = parseDateTime(event.startDate);
    const endDateTime = parseDateTime(event.endDate);

    if (!dateTime && startDateTime && endDateTime) {
      dateTime = endDateTime.minus({
        milliseconds: endDateTime.diff(startDateTime).as("milliseconds") / 2,
      });
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

    let groupIndex = 0;
    if (timelineConfig.groupBy) {
      const groupKey = event[timelineConfig.groupBy] as string;

      if (!groupMap[groupKey]) {
        groupIndex = Object.keys(groupMap).length;
        groupMap[groupKey] = {
          name: groupKey,
          index: groupIndex,
        };
      } else {
        groupIndex = groupMap[groupKey].index;
      }
    } else {
      groupIndex = 0;

      groupMap[""] = {
        name: "Ungrouped",
        index: groupIndex,
      };
    }

    return events.concat({
      ...event,
      x: -1, // since required
      y: groupIndex * timelineConfig.rowHeight + timelineConfig.rowHeight / 2,
      dateTime: dateTime!,
      startDateTime,
      endDateTime,
    });
  }, []);

  // todo throw error on no { minDateTime, maxDateTime }

  console.log({ minDateTime, maxDateTime, groupMap });

  const eventsDurationMilliseconds =
    maxDateTime!.diff(minDateTime!).as("milliseconds") || 10000000; //if only one event, make it something, what though?

  const gridResolution = getGridResolution(eventsDurationMilliseconds);

  const gridStartDateTime = minDateTime!.startOf(
    gridResolutionToDuration(gridResolution)
  );
  const gridEndDateTime = maxDateTime!.endOf(
    gridResolutionToDuration(gridResolution)
  );

  const gridDurationMilliseconds = gridEndDateTime!
    .diff(gridStartDateTime!)
    .as("milliseconds");

  console.log({ gridStartDateTime, gridEndDateTime, gridDurationMilliseconds });

  clientEvents = clientEvents.map((event) => {
    return {
      ...event,
      x: getGridPositonX(
        event.dateTime,
        gridStartDateTime,
        gridDurationMilliseconds,
        gridWidth
      ),
      startX: event.startDateTime
        ? getGridPositonX(
            event.startDateTime,
            gridStartDateTime,
            gridDurationMilliseconds,
            gridWidth
          )
        : undefined,
      endX: event.endDateTime
        ? getGridPositonX(
            event.endDateTime,
            gridStartDateTime,
            gridDurationMilliseconds,
            gridWidth
          )
        : undefined,
    };
  });

  clientEvents.sort((a, b) =>
    (a.startDateTime || a.dateTime!)
      .diff(b.startDateTime || b.dateTime!)
      .as("milliseconds")
  );

  // FINISH THIS
  const contextualDiff = gridEndDateTime!.diff(gridStartDateTime!).as("years");

  const numberOfTicks = Math.ceil(gridWidth / timelineConfig.tickDensity);

  const clientTicks = Array.from({ length: numberOfTicks + 1 }, (_, i) => {
    const x = (i / numberOfTicks) * gridWidth;
    const tickDateMilliseconds = (i / numberOfTicks) * gridDurationMilliseconds;
    return {
      x,
      label: gridStartDateTime
        .plus({ milliseconds: tickDateMilliseconds })
        .toFormat(gridResolutionToFormat(gridResolution)),
    };
  });

  return {
    ...timelineConfig,
    gridHeight: timelineConfig.rowHeight * Object.keys(groupMap).length,
    gridWidth,
    width: containerWidth,
    height: containerHeight,
    clientEvents,
    clientGroups: Object.values(groupMap),
    eventsDurationMilliseconds,
    gridDurationMilliseconds,
    gridEndDateTime,
    maxDateTime,
    gridStartDateTime,
    minDateTime,
    clientTicks,
  };
};

enum GridStep {
  DECADE = "DECADE",
  YEAR = "YEAR",
  MONTH = "MONTH",
  DAY = "DAY",
  HOUR = "HOUR",
  MINUTE = "MINUTE",
  SECOND = "SECOND",
  MILLISECOND = "MILLISECOND",
}

const gridResolutionToDuration = (gridResolution: GridStep) => {
  switch (gridResolution) {
    case GridStep.YEAR:
      return "year";
    default:
      return "minute";
  }
};

const gridResolutionToFormat = (gridResolution: GridStep) => {
  switch (gridResolution) {
    case GridStep.YEAR:
      return "yyyy";
    default:
      return "yyyy-MM-dd";
  }
};

const getGridResolution = (eventsDurationMilliseconds: number) => {
  return eventsDurationMilliseconds > MILLISECONDS_IN_DECADE
    ? GridStep.YEAR
    : eventsDurationMilliseconds > MILLISECONDS_IN_YEAR
    ? GridStep.MONTH
    : eventsDurationMilliseconds > MILLISECONDS_IN_MONTH
    ? GridStep.DAY
    : GridStep.HOUR;
};

const getGridPositonX = (
  dateTime: DateTime,
  gridStartDateTime: DateTime,
  gridDurationMilliseconds: number,
  gridWidth: number
) => {
  return (
    (dateTime.diff(gridStartDateTime).as("milliseconds") /
      gridDurationMilliseconds) *
    gridWidth
  );
};
