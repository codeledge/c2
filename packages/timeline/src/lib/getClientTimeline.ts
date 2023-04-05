import { DateTime, DateTimeUnit } from "luxon";
import { parseDateTime } from "@c2/core";
import {
  ClientTimelineEvent,
  TimelineEventData,
} from "../components/TimelineEvent";
import { TimelineConfig, ClientTimeline } from "../Timeline";
import { getGridResolution } from "./getGridResolution";

export const getClientTimeline = (
  timelineConfig: TimelineConfig,
  events: TimelineEventData[]
): ClientTimeline => {
  console.time("getClientTimeline");

  const gridWidth =
    timelineConfig.containerWidth! -
    timelineConfig.rowDrawerWidth -
    timelineConfig.gridMarginRight +
    2; // 1 px for the border on each side

  events.sort((a, b) => {
    return parseDateTime(a.startDate || a.date)!
      .diff(parseDateTime(b.startDate || b.date)!)
      .as("milliseconds");
  });

  let minDateTime: DateTime | undefined;
  let maxDateTime: DateTime | undefined;

  const groupMap: Record<string, { name: string; index: number }> = {};

  let eventIndex = 0;
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

    // const previousEvent = last(events);
    // if (
    //   previousEvent &&
    //   Math.abs(
    //     minDateTime!.diff(previousEvent.endDateTime!).as("milliseconds")
    //   ) < 200000000
    // ) {
    //   previousEvent.endDateTime = maxDateTime!;
    //   previousEvent.groupLabel = "Grouped";
    //   previousEvent.name = "";
    //   return events;
    // }

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
      groupIndex,
      dateTime: dateTime!,
      startDateTime,
      endDateTime,
      eventIndex: eventIndex++,
    });
  }, []);

  // todo throw error on no { minDateTime, maxDateTime }

  const eventsRangeMs =
    maxDateTime!.diff(minDateTime!).as("milliseconds") || 10000000; //if only one event, make it something, what though?

  const gridDurationPaddingMilliseconds = Math.floor(eventsRangeMs * 0.1);

  const gridStartDateTime = minDateTime!.minus({
    milliseconds: gridDurationPaddingMilliseconds,
  });

  const gridEndDateTime = maxDateTime!.plus({
    milliseconds: gridDurationPaddingMilliseconds,
  });

  const gridRangeMs = gridEndDateTime!
    .diff(gridStartDateTime!)
    .as("milliseconds");

  const gridResolution = getGridResolution(
    eventsRangeMs,
    gridWidth,
    timelineConfig.minTickStepWidth
  );

  console.log(gridResolution);

  const tickUnit = Object.keys(gridResolution)[0] as DateTimeUnit;

  let currentTick = gridStartDateTime.startOf(tickUnit);

  const clientTicks = [];
  while (currentTick <= gridEndDateTime) {
    if (currentTick >= gridStartDateTime) {
      clientTicks.push({
        x: getGridPositonX(
          currentTick,
          gridStartDateTime,
          gridRangeMs,
          gridWidth
        ),
        label: currentTick.toFormat(gridStepDurationToFormat(tickUnit)),
      });
    }
    currentTick = currentTick.plus(gridResolution);
  }

  console.log({
    events: clientEvents.length,
    // gridWidth,
    // minDateTime: minDateTime!.toISO(),
    // maxDateTime: maxDateTime!.toISO(),
    // groupMap,
    // gridResolution,
    // eventsRangeMs,
    // gridDurationPaddingMilliseconds,
    // gridStartDateTime: gridStartDateTime!.toISO(),
    // gridEndDateTime: gridEndDateTime!.toISO(),
    // gridRangeMs,
  });

  clientEvents = clientEvents.map((event) => {
    return {
      ...event,
      x: getGridPositonX(
        event.dateTime,
        gridStartDateTime,
        gridRangeMs,
        gridWidth
      ),
      startX: event.startDateTime
        ? getGridPositonX(
            event.startDateTime,
            gridStartDateTime,
            gridRangeMs,
            gridWidth
          )
        : undefined,
      endX: event.endDateTime
        ? getGridPositonX(
            event.endDateTime,
            gridStartDateTime,
            gridRangeMs,
            gridWidth
          )
        : undefined,
    };
  });

  console.timeEnd("getClientTimeline");

  return {
    ...timelineConfig,
    scrollableHeight:
      timelineConfig.containerHeight! - timelineConfig.actionsHeight,
    gridHeight: timelineConfig.rowHeight * Object.keys(groupMap).length,
    gridWidth,
    clientEvents,
    clientGroups: Object.values(groupMap),
    eventsRangeMs,
    gridRangeMs,
    gridEndDateTime,
    maxDateTime,
    gridStartDateTime,
    minDateTime,
    clientTicks,
  };
};

const gridStepDurationToFormat = (gridResolution: DateTimeUnit) => {
  switch (gridResolution) {
    case "year":
      return "yyyy";
    case "month":
      return "yyyy-MM";
    case "day":
      return "yyyy-MM-dd";
    default:
      return "yyyy-MM-dd HH:mm";
  }
};

const getGridPositonX = (
  dateTime: DateTime,
  gridStartDateTime: DateTime,
  gridRangeMs: number,
  gridWidth: number
) => {
  return (
    (dateTime.diff(gridStartDateTime).as("milliseconds") / gridRangeMs) *
    gridWidth
  );
};
