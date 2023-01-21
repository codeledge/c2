import { Meta } from "@storybook/react";
import { SvgContainer } from "../helpers/SvgContainer";
import { TimelineEvent } from "../../src/components/TimelineEvent";
import { randomClientTimeline } from "../../fixtures/randomTimeline";
import { parseDateTime } from "shapes";

export default {
  title: "Components/TimelineEvent",
} as Meta;

export const DateEvent = () => {
  return (
    <SvgContainer>
      <TimelineEvent
        event={{
          name: "Event 1",
          date: "2021-01-01",
          dateTime: parseDateTime("2021-01-01")!,
          x: 100,
          y: 100,
        }}
        clientTimeline={randomClientTimeline()}
      />
    </SvgContainer>
  );
};

export const DurationEvent = () => {
  return (
    <SvgContainer>
      <TimelineEvent
        event={{
          name: "Event 1",
          startDate: "2021-01-01",
          endDate: "2021-02-01",
          dateTime: parseDateTime("2021-01-01")!, //wrong
          startDateTime: parseDateTime("2021-01-01")!,
          endDateTime: parseDateTime("2021-02-01")!,
          x: 150,
          y: 100,
          startX: 100,
          endX: 200,
        }}
        clientTimeline={randomClientTimeline()}
      />
    </SvgContainer>
  );
};
