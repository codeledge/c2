import { DateTime } from "luxon";
import { ReactNode } from "react";
import {
  TimelineEvent,
  TimelineEventProps,
  TimelineEventData,
} from "../components/TimelineEvent";

export type TimelineRow = {
  id?: string;
  name?: string;
  events: TimelineEventData[];
};

export type TimelineOptions = {
  rowHeight?: number;
  gridWidth?: number;
  gridLeft?: number;
  gridTop?: number;
};

export type TimelineProps = {
  rows: TimelineRow[];
  title?: ReactNode;
  onEventClick?: TimelineEventProps["onEventClick"];
};

export const Timeline = ({
  rows,
  options,
  onEventClick,
}: {
  options?: TimelineOptions;
} & TimelineProps) => {
  const rowHeight = options?.rowHeight ?? 50;
  const gridWidth = options?.gridWidth ?? 1000;
  const gridLeft = options?.gridLeft ?? 50;
  const gridTop = options?.gridTop ?? 50;
  const tickDensity = 10;
  const gridHeight = rowHeight * rows.length;
  const primaryColor = "grey";
  const secondaryColor = "grey";
  const backgroundColor = "lightGrey";
  ///////////////////////

  const getRowTopY = (rowIndex: number) => {
    return rowHeight * rowIndex;
  };

  const getRowBottomY = (rowIndex: number) => {
    return getRowTopY(rowIndex) + rowHeight;
  };

  const getRowMidY = (rowIndex: number) => {
    return getRowTopY(rowIndex) + rowHeight / 2;
  };

  let minDate: DateTime;
  let maxDate: DateTime;

  rows.forEach((row) => {
    row.events.forEach((event) => {
      const eventDateTime = DateTime.fromISO(event.date);
      if (!minDate) {
        minDate = eventDateTime;
      }
      if (!maxDate) {
        maxDate = eventDateTime;
      }
      if (eventDateTime < minDate) {
        minDate = eventDateTime;
      }
      if (eventDateTime > maxDate) {
        maxDate = eventDateTime;
      }
    });
  });

  // todo throw error on no events

  const maxTimeInterval = maxDate!.diff(minDate!);
  const maxTimeIntervalMilliseconds = maxTimeInterval!.as("milliseconds");

  const minDateEdge = minDate!.minus({
    milliseconds: maxTimeIntervalMilliseconds / 10,
  });
  const maxDateEdge = maxDate!.plus({
    milliseconds: maxTimeIntervalMilliseconds / 10,
  });

  const gridIntervalMilliseconds = maxDateEdge!
    .diff(minDateEdge!)
    .as("milliseconds");

  const tickStepMilliseconds = gridIntervalMilliseconds / tickDensity;

  const ticks = Array.from({ length: tickDensity + 1 }, (_, i) => {
    const x = (i / 10) * gridWidth;
    return {
      x,
      label: minDateEdge
        .plus({ milliseconds: tickStepMilliseconds * i })
        .toFormat("yyyy-MM-dd HH:mm:ss"),
    };
  });

  const getEventX = (event: TimelineEventData) => {
    return (
      (DateTime.fromISO(event.date).diff(minDateEdge!).as("milliseconds") /
        gridIntervalMilliseconds) *
      gridWidth
    );
  };

  return (
    <g transform={`translate(${gridLeft},${gridTop})`}>
      <g>
        {ticks.map((tick) => {
          return (
            <g key={tick.x}>
              <text
                x={tick.x}
                y={-10}
                fontSize={9}
                textAnchor="middle"
                fill={primaryColor}
              >
                {tick.label}
              </text>
              <line
                x1={tick.x}
                y1={0}
                x2={tick.x}
                y2={-5}
                stroke={primaryColor}
              />
              <line
                className="tickerDottedLine"
                x1={tick.x}
                x2={tick.x}
                y1={0}
                y2={gridHeight}
                stroke={primaryColor}
                strokeWidth={1}
                strokeDasharray="5,5"
              ></line>
            </g>
          );
        })}
        <line
          className="tickerBottom"
          x1={0}
          x2={gridWidth}
          y1={0}
          y2={0}
          stroke={primaryColor}
          strokeWidth={1}
        ></line>
      </g>

      {rows.map((row, rowIndex) => {
        return (
          <g>
            <g>
              {row.events.map((event) => {
                return (
                  <TimelineEvent
                    x={getEventX(event)}
                    y={getRowMidY(rowIndex)}
                    onEventClick={onEventClick}
                    event={event}
                  />
                );
              })}
            </g>
            <line
              x1={0}
              x2={gridWidth}
              y1={getRowBottomY(rowIndex)}
              y2={getRowBottomY(rowIndex)}
              stroke={primaryColor}
              strokeWidth={1}
            ></line>
          </g>
        );
      })}
      <line
        className="timelineGridEdgeLeft"
        x1={0}
        x2={0}
        y1={0}
        y2={gridHeight}
        stroke={primaryColor}
        strokeWidth={1}
      ></line>
      <line
        className="timelineGridEdgeRight"
        x1={gridWidth}
        x2={gridWidth}
        y1={0}
        y2={gridHeight}
        stroke={primaryColor}
        strokeWidth={1}
      ></line>
    </g>
  );
};
