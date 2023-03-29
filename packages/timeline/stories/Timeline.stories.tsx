import { Meta } from "@storybook/react";
import { paintings } from "../fixtures/paintings";
import { randomTimelineData } from "../fixtures/randomTimeline";
import { Timeline } from "../src/Timeline";

export default {
  title: "Components/Timeline",
  component: Timeline,
} as Meta;

export const SingleRow = () => {
  return (
    <Timeline
      events={[
        {
          id: 1,
          name: "Event 1",
          startDate: "2021-01-01T00:00:00.000Z",
          endDate: "2021-01-01T00:00:00.000Z",
          images: [
            {
              url: "https://picsum.photos/200/300",
            },
          ],
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
        {
          id: 4,
          name: "Event 4",
          startDate: "2022-01-03T00:00:00.000Z",
          endDate: "2022-01-04T00:00:00.000Z",
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
        groupBy: "city",
      }}
      height={400}
      width={1200}
      events={randomTimelineData()}
      onEventClick={(event) => {
        //@ts-ignore
        alert(JSON.stringify(event));
      }}
    />
  );
};

export const Paintings = () => {
  return (
    <Timeline
      options={{
        gridZoom: 1,
        tickDensity: 50,
        groupBy: "Type",
        eventDateFormat: "yyyy",
      }}
      height={600}
      width={"100%"}
      events={paintings.slice(100, 200).map((event) => ({
        ...event,
        date: event.start,
        name: event.title,
      }))}
      onEventClick={(event) => {
        //@ts-ignore
        alert(JSON.stringify(event));
      }}
    />
  );
};
