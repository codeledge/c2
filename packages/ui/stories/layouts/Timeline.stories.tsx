import { Meta } from "@storybook/react";
import { randomTimelineData } from "../../fixtures/randomTimeline";
import { Timeline } from "../../src/layouts/Timeline";

export default {
  title: "Components/Timeline",
} as Meta;

export const SingleRow = () => {
  return <Timeline rows={randomTimelineData()} />;
};

export const MultiRow = () => {
  return (
    <Timeline
      options={{
        gridZoom: 2,
      }}
      rows={randomTimelineData()}
      onEventClick={(event) => {
        //@ts-ignore
        alert(JSON.stringify(event));
      }}
    />
  );
};
