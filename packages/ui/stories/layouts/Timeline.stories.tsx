import { Meta } from "@storybook/react";
import { randomTimelineData } from "../../fixtures/randomTimeline";
import { Timeline } from "../../src/layouts/Timeline";

export default {
  title: "Components/Timeline",
} as Meta;

export const SingleRow = () => {
  return (
    <Timeline
      rows={[
        {
          id: 1,
          name: "Row 1",
          events: [
            {
              id: 1,
              name: "Event 1",
              startDate: "2021-01-01T00:00:00.000Z",
              endDate: "2021-01-01T00:00:00.000Z",
            },
            {
              id: 2,
              name: "Event 2",
              startDate: "2021-01-02T00:00:00.000Z",
              endDate: "2021-01-03T00:00:00.000Z",
            },
            {
              id: 3,
              name: "Event 3",

              startDate: "2021-01-03T00:00:00.000Z",
              endDate: "2021-01-04T00:00:00.000Z",
            },
          ],
        },
      ]}
    />
  );
};

export const MultiRow = () => {
  return (
    <Timeline
      options={{
        gridZoom: 1,
        tickDensity: 50,
      }}
      height={200}
      width={400}
      rows={randomTimelineData()}
      onEventClick={(event) => {
        //@ts-ignore
        alert(JSON.stringify(event));
      }}
    />
  );
};
