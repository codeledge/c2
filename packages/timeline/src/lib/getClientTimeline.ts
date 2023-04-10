import { DateTime, DateTimeUnit } from "luxon";
import { parseDateTime } from "@c2/core";
import {
  ClientTimelineEvent,
  TimelineEventData,
} from "../components/TimelineEvent";
import { getGridResolution } from "./getGridResolution";
import { ClientTimeline } from "../types/ClientTimeline";
import { TimelineConfig } from "../types/TimelineConfig";
import { ClientTimelineRowLabel } from "../components/TimelineRowLabels";
import { last } from "deverything";

export const getClientTimeline = (
  timelineConfig: TimelineConfig,
  events: TimelineEventData[]
): ClientTimeline => {
  console.time("getClientTimeline");

  const gridWidth =
    (timelineConfig.containerWidth! -
      (timelineConfig.showRowLabels ? timelineConfig.rowDrawerWidth : 0) -
      timelineConfig.gridMargin * 2) *
    timelineConfig.gridZoom;

  if (gridWidth <= 0)
    throw new Error("gridWidth is < 0, this should not happen");

  let minDateTime: DateTime | undefined;
  let maxDateTime: DateTime | undefined;

  const groupMap: Record<string, ClientTimelineRowLabel> = {};

  events.sort((a, b) => {
    return (b.startDate || b.date)! > (a.startDate || a.date)! ? -1 : 1;
  });

  let eventIndex = 0;
  let clientEvents = events.reduce((events: ClientTimelineEvent[], event) => {
    let dateTime: DateTime;
    let edgeEndDateTime: DateTime;
    let edgeStartDateTime: DateTime;
    let startDateTime: DateTime | undefined;
    let endDateTime: DateTime | undefined;
    if (event.date && !(event.startDate && event.endDate)) {
      const parsedDateTime = parseDateTime(event.date);
      if (!parsedDateTime) {
        console.log("skipped event", event);
        return events;
      }
      dateTime = edgeEndDateTime = edgeStartDateTime = parsedDateTime;
    } else if (event.startDate && event.endDate) {
      startDateTime = parseDateTime(event.startDate);
      endDateTime = parseDateTime(event.endDate);
      if (!startDateTime || !endDateTime) {
        console.log("skipped event", event);
        return events;
      }
      dateTime = getRandMidDateTime(startDateTime, endDateTime);
      edgeEndDateTime = endDateTime;
      edgeStartDateTime = startDateTime;
    } else {
      console.log("skipped event", event);
      return events;
    }

    if (!minDateTime || edgeStartDateTime < minDateTime) {
      minDateTime = edgeStartDateTime;
    }
    if (!maxDateTime || edgeEndDateTime > maxDateTime) {
      maxDateTime = edgeEndDateTime;
    }

    const previousEvent = last(events);
    if (
      previousEvent &&
      Math.abs(
        edgeStartDateTime.diff(previousEvent.edgeEndDateTime).as("milliseconds")
      ) < 10000000000
    ) {
      previousEvent.edgeEndDateTime = edgeEndDateTime;
      previousEvent.dateTime = getRandMidDateTime(
        previousEvent.edgeStartDateTime,
        previousEvent.edgeEndDateTime
      );
      previousEvent.clusterLabel = "Grouped";
      previousEvent.name = "";
      return events;
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
      edgeEndDateTime,
      edgeStartDateTime,
      eventIndex: eventIndex++, // doesn't work if sorting happens after this
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
      startX: event.edgeStartDateTime
        ? getGridPositonX(
            event.edgeStartDateTime,
            gridStartDateTime,
            gridRangeMs,
            gridWidth
          )
        : undefined,
      endX: event.edgeEndDateTime
        ? getGridPositonX(
            event.edgeEndDateTime,
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
    clientEvents,
    clientGroups: Object.values(groupMap),
    clientTicks,
    eventsRangeMs,
    gridEndDateTime,
    gridHeight: timelineConfig.rowHeight * Object.keys(groupMap).length,
    gridRangeMs,
    gridStartDateTime,
    gridWidth,
    gridX:
      timelineConfig.gridMargin +
      (timelineConfig.showRowLabels ? timelineConfig.rowDrawerWidth : 0),
    maxDateTime,
    minDateTime,
    scrollableHeight:
      timelineConfig.containerHeight - timelineConfig.ticksHeight,
    scrollableWidth: timelineConfig.showRowLabels
      ? timelineConfig.containerWidth - timelineConfig.gridMargin * 2
      : timelineConfig.containerWidth -
        timelineConfig.rowDrawerWidth -
        timelineConfig.gridMargin * 2,
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

const getRandMidDateTime = (startDateTime: DateTime, endDateTime: DateTime) => {
  return endDateTime.minus({
    milliseconds: endDateTime.diff(startDateTime).as("milliseconds") / 2,
  });
};
