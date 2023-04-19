import { Meta } from "@storybook/react";
import { paintings } from "../fixtures/paintings";
import { randomTimelineData } from "../fixtures/randomTimeline";
import { CanvasTimeline } from "../src/Timeline";
import { airplaneCrashes } from "../fixtures/airplaneCrashes";
import { randomBool } from "deverything";

export default {
  title: "Components/Timeline",
} as Meta;

export const CanvasSingle = () => {
  return (
    <CanvasTimeline
      options={{
        gridZoom: 1,
        minTickStepWidth: 150,
        eventDateFormat: "yyyy-MM-dd",
        eventCircleRadius: 6,
      }}
      height={600}
      width={"100%"}
      events={[
        {
          id: 1,
          name: "Event 1",
          date: "2021-01-01T00:00:00.000Z",
          // endDate: "2021-01-01T00:00:00.000Z",
          images: [
            {
              url: "https://picsum.photos/200/300",
            },
          ],
        },
        {
          id: 2,
          name: "Event 2",
          // date: "2021-01-02T00:0:00.000Z",
          startDate: "2021-01-01T06:00:00.000Z",
          endDate: "2021-01-03T00:00:00.000Z",
        },
        {
          id: 3,
          name: "Event 3",
          startDate: "2021-01-03T00:00:00.000Z",
          endDate: "2021-01-04T00:00:00.000Z",
        },
        // {
        //   id: 4,
        //   name: "Event 4",
        //   startDate: "2022-01-03T00:00:00.000Z",
        //   endDate: "2022-01-04T00:00:00.000Z",
        // },
      ]}
    />
  );
};

export const CanvasRandom = () => {
  return (
    <CanvasTimeline
      options={{
        gridZoom: 1,
        minTickStepWidth: 150,
        groupBy: "city",
        eventDateFormat: "yyyy-MM-dd",
        showEventDates: randomBool(),
        showEventLabels: randomBool(),
      }}
      height={600}
      width={"100%"}
      events={randomTimelineData()}
    />
  );
};

export const CanvasPaintings = () => {
  return (
    <CanvasTimeline
      options={{
        gridZoom: 1,
        minTickStepWidth: 70,
        groupBy: "Type",
        eventDateFormat: "yyyy",
      }}
      height={600}
      width={"90%"}
      events={paintings.slice(0, 1000).map((event) => ({
        ...event,
        date: event.start,
        name: event.title,
      }))}
    />
  );
};

export const AirplaneCrashes = () => {
  return (
    <CanvasTimeline
      options={{
        gridZoom: 1,
        minTickStepWidth: 90,
        groupBy: "Type",
        eventDateFormat: "yyyy",
      }}
      events={airplaneCrashes.slice(0, 100).map((event) => ({
        Type: event.Type,
        date: event.Date + " " + event.Time,
        name: event.Location,
      }))}
    />
  );
};
