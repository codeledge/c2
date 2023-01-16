import { Meta } from "@storybook/react";
import { useState } from "react";
import { Timeline } from "../../src/layouts/Timeline";
import { SvgContainer } from "../helpers/SvgContainer";

export default {
  title: "Components/Timeline",
} as Meta;

export const SingleRow = () => {
  return (
    <SvgContainer>
      <Timeline
        rows={[
          {
            name: "Row 1",
            events: [
              {
                name: "Event 1",
                date: "2021-01-01",
              },
            ],
          },
        ]}
      />
    </SvgContainer>
  );
};

export const MultiRow = () => {
  return (
    <SvgContainer>
      <Timeline
        rows={[
          {
            name: "Row 1",
            events: [
              {
                name: "Event 1",
                date: "2021-01-01",
              },
            ],
          },
          {
            name: "Row 2",
            events: [
              {
                name: "Event 1",
                date: "2022-01-01",
              },
              {
                name: "Duration event",
                startDate: "2021-03-18",
                endDate: "2021-05-22",
              },
            ],
          },
          {
            name: "Row 3",
            events: [
              {
                name: "Event 1",
                date: "2021-08-01",
              },
              {
                name: "No start event",
                endDate: "2022-07-01",
              },
            ],
          },
          {
            name: "Row 4",
            events: [
              {
                name: "No end event",
                startDate: "2022-07-01",
              },
              {
                name: "Event 1",
                date: "2022-07-01",
              },
            ],
          },
        ]}
        onEventClick={(event) => {
          console.log(event);
        }}
      />
    </SvgContainer>
  );
};
