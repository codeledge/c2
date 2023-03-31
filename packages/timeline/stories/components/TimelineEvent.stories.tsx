import { Meta } from "@storybook/react";
import {
  ClientTimelineEvent,
  TimelineEvent,
} from "../../src/components/TimelineEvent";
import { randomClientTimeline } from "../../fixtures/randomTimeline";
import { parseDateTime } from "@c2/core";
import { SvgContainer } from "../helpers/SvgContainer";

export default {
  title: "Components/TimelineEvent",
} as Meta;

export const DateEvent = () => {
  const event: ClientTimelineEvent = {
    name: "Event 1",
    date: "2021-01-01",
    dateTime: parseDateTime("2021-01-01")!,
    groupIndex: 0,
    eventIndex: 0,
    x: 100,
    y: 100,
  };
  return (
    <SvgContainer>
      <TimelineEvent
        event={event}
        clientTimeline={randomClientTimeline({}, [event])}
      />
    </SvgContainer>
  );
};

export const DurationEvent = () => {
  const event: ClientTimelineEvent = {
    name: "Event 1",
    startDate: "2021-01-01",
    endDate: "2021-02-01",
    dateTime: parseDateTime("2021-01-01")!, //wrong
    startDateTime: parseDateTime("2021-01-01")!,
    endDateTime: parseDateTime("2021-02-01")!,
    groupIndex: 0,
    eventIndex: 0,
    x: 150,
    y: 100,
    startX: 100,
    endX: 200,
  };
  return (
    <SvgContainer>
      <TimelineEvent
        event={event}
        clientTimeline={randomClientTimeline({}, [event])}
      />
    </SvgContainer>
  );
};

export const GroupEvent = () => {
  const event: ClientTimelineEvent = {
    groupLabel: "32 events...",
    startDate: "2021-01-01",
    endDate: "2021-02-01",
    dateTime: parseDateTime("2021-01-01")!, //wrong
    startDateTime: parseDateTime("2021-01-01")!,
    endDateTime: parseDateTime("2021-02-01")!,
    groupIndex: 0,
    eventIndex: 0,
    x: 150,
    y: 100,
    startX: 100,
    endX: 200,
  };
  return (
    <SvgContainer>
      <TimelineEvent
        event={event}
        clientTimeline={randomClientTimeline({}, [event])}
      />
    </SvgContainer>
  );
};
