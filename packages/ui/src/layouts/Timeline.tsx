import { DateTime } from "luxon";
import { ReactNode } from "react";
import { parseDateTime } from "shapes";
import {
  TimelineEvent,
  TimelineEventProps,
  TimelineEventData,
} from "../components/TimelineEvent";
import { getGridData } from "../lib/getGridData";

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

export type TimelineConfig = {
  backgroundColor: string;
  gridHeight: number;
  gridLeft: number;
  gridTop: number;
  gridWidth: number;
  primaryColor: string;
  secondaryColor: string;
  tickDensity: number;
  rowHeight: number;
};

export const Timeline = ({
  rows,
  options,
  onEventClick,
}: {
  options?: TimelineOptions;
} & TimelineProps) => {
  const rowHeight = options?.rowHeight ?? 50;
  const timelineConfig: TimelineConfig = {
    rowHeight,
    gridWidth: options?.gridWidth ?? 1000,
    gridLeft: options?.gridLeft ?? 50,
    gridTop: options?.gridTop ?? 50,
    tickDensity: 10,
    gridHeight: rowHeight * rows.length,
    primaryColor: "grey",
    secondaryColor: "grey",
    backgroundColor: "lightGrey",
  };
  ///////////////////////

  const getRowTopY = (rowIndex: number) => {
    return rowHeight * rowIndex;
  };

  const getRowBottomY = (rowIndex: number) => {
    return getRowTopY(rowIndex) + rowHeight;
  };

  const { clientEvents, ticks } = getGridData(rows, timelineConfig);

  return (
    <g
      transform={`translate(${timelineConfig.gridLeft},${timelineConfig.gridTop})`}
    >
      <g>
        {ticks.map((tick) => {
          return (
            <g key={tick.x}>
              <text
                x={tick.x}
                y={-10}
                fontSize={9}
                textAnchor="middle"
                fill={timelineConfig.primaryColor}
              >
                {tick.label}
              </text>
              <line
                x1={tick.x}
                y1={0}
                x2={tick.x}
                y2={-5}
                stroke={timelineConfig.primaryColor}
              />
              <line
                className="tickerDottedLine"
                x1={tick.x}
                x2={tick.x}
                y1={0}
                y2={timelineConfig.gridHeight}
                stroke={timelineConfig.primaryColor}
                strokeWidth={1}
                strokeDasharray="5,5"
              ></line>
            </g>
          );
        })}
        <line
          className="tickerBottom"
          x1={0}
          x2={timelineConfig.gridWidth}
          y1={0}
          y2={0}
          stroke={timelineConfig.primaryColor}
          strokeWidth={1}
        ></line>
      </g>

      {rows.map((row, rowIndex) => {
        return (
          <g>
            <line
              x1={0}
              x2={timelineConfig.gridWidth}
              y1={getRowBottomY(rowIndex)}
              y2={getRowBottomY(rowIndex)}
              stroke={timelineConfig.primaryColor}
              strokeWidth={1}
            ></line>
          </g>
        );
      })}

      {clientEvents.map((event) => {
        return (
          <TimelineEvent
            onEventClick={onEventClick}
            event={event}
            timelineConfig={timelineConfig}
          />
        );
      })}

      <line
        className="timelineGridEdgeLeft"
        x1={0}
        x2={0}
        y1={0}
        y2={timelineConfig.gridHeight}
        stroke={timelineConfig.primaryColor}
        strokeWidth={1}
      ></line>
      <line
        className="timelineGridEdgeRight"
        x1={timelineConfig.gridWidth}
        x2={timelineConfig.gridWidth}
        y1={0}
        y2={timelineConfig.gridHeight}
        stroke={timelineConfig.primaryColor}
        strokeWidth={1}
      ></line>
    </g>
  );
};
