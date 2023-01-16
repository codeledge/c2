import { Meta } from "@storybook/react";
import { WaterPipePath } from "../../src/components/WaterPipePath";
import { useState } from "react";
import { DraggableDot } from "../helpers/DraggableDot";
import { SvgContainer } from "../helpers/SvgContainer";
import { TimelineEvent } from "../../src/components/TimelineEvent";
import { defaultTimelineConfig } from "../../fixtures/defaultTimelineConfig";
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
          dateTime: parseDateTime("2021-01-01"),
          x: 100,
          y: 100,
        }}
        timelineConfig={defaultTimelineConfig}
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
          startDateTime: parseDateTime("2021-01-01"),
          endDateTime: parseDateTime("2021-02-01"),
          x: 150,
          y: 100,
          startX: 100,
          endX: 200,
        }}
        timelineConfig={defaultTimelineConfig}
      />
    </SvgContainer>
  );
};

export const StartOnlyEvent = () => {
  return (
    <SvgContainer>
      <TimelineEvent
        event={{
          name: "Event 1",
          startDate: "2021-01-01",
          startDateTime: parseDateTime("2021-01-01"),
          x: 100,
          y: 100,
          startX: 100,
        }}
        timelineConfig={defaultTimelineConfig}
      />
    </SvgContainer>
  );
};

export const EndOnlyEvent = () => {
  return (
    <SvgContainer>
      <TimelineEvent
        event={{
          name: "Event 1",
          endDate: "2021-01-01",
          endDateTime: parseDateTime("2021-01-01"),
          x: 100,
          y: 100,
          endX: 100,
        }}
        timelineConfig={defaultTimelineConfig}
      />
    </SvgContainer>
  );
};
