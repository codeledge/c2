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

export type TimelineProps = {
  rows: TimelineRow[];
  title?: ReactNode;
  onEventClick?: TimelineEventProps["onEventClick"];
  options?: Partial<TimelineConfig>;
};

export type TimelineConfig = {
  backgroundColor: string;
  gridHeight: number;
  gridWidth: number;
  height: number;
  primaryColor: string;
  rowDrawerWidth: number;
  rowHeight: number;
  secondaryColor: string;
  tickDensity: number;
  ticksHeight: number;
  width: number;
};

export const Timeline = ({ rows, options, onEventClick }: TimelineProps) => {
  const rowHeight = options?.rowHeight ?? 50;
  const rowDrawerWidth = options?.rowDrawerWidth ?? 150;
  const height = options?.height ?? 400;
  const width = options?.width ?? 800;
  const timelineConfig: TimelineConfig = {
    backgroundColor: "lightGrey",
    gridHeight: rowHeight * rows.length,
    gridWidth: width + rowDrawerWidth,
    height,
    primaryColor: "grey",
    rowDrawerWidth,
    rowHeight,
    secondaryColor: "grey",
    tickDensity: 10,
    ticksHeight: 30,
    width,
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
    <div
      style={{
        backgroundColor: timelineConfig.backgroundColor,
        position: "relative",
        height: timelineConfig.height,
        width: timelineConfig.width,
      }}
    >
      <div
        style={{
          background: timelineConfig.backgroundColor,
          height: timelineConfig.ticksHeight,
          left: 0,
          position: "absolute",
          top: 0,
          width: timelineConfig.rowDrawerWidth,
          zIndex: 1,
        }}
      ></div>
      <div
        id="scrollable"
        style={{
          overflow: "auto",
          position: "relative",
          height: timelineConfig.height,
          width: timelineConfig.width,
        }}
      >
        <div
          id="tick-wrapper"
          style={{
            position: "sticky",
            top: 0,
            paddingLeft: timelineConfig.rowDrawerWidth,
            background: timelineConfig.backgroundColor,
            height: timelineConfig.ticksHeight,
            width: timelineConfig.gridWidth,
          }}
        >
          <svg
            width={timelineConfig.gridWidth}
            height={timelineConfig.ticksHeight}
          >
            <g
              id="ticks"
              transform={`translate(0 ${timelineConfig.ticksHeight})`}
            >
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
              />
            </g>
          </svg>
        </div>
        <div
          id="grid-wrapper"
          style={{
            display: "flex",
          }}
        >
          <div
            style={{
              position: "sticky",
              left: 0,
              flex: `0 0 ${timelineConfig.rowDrawerWidth}px`,
              background: timelineConfig.backgroundColor,
              borderRight: `1px solid ${timelineConfig.primaryColor}`,
              boxSizing: "border-box",
            }}
          >
            {rows.map((row, rowIndex) => {
              return (
                <div
                  style={{
                    height: timelineConfig.rowHeight,
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      paddingRight: 10,
                    }}
                  >
                    <p style={{ textAlign: "right" }}>{row.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <svg
            width={timelineConfig.gridWidth}
            height={timelineConfig.gridHeight}
            style={{
              flex: `0 0 ${timelineConfig.gridWidth}px`,
            }}
          >
            {ticks.slice(1).map((tick) => {
              return (
                <g key={tick.x}>
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
            {rows.map((row, rowIndex) => {
              return (
                <line
                  className="timelineGridRowBottomLine"
                  x1={0}
                  x2={timelineConfig.gridWidth}
                  y1={getRowBottomY(rowIndex)}
                  y2={getRowBottomY(rowIndex)}
                  stroke={timelineConfig.primaryColor}
                  strokeWidth={1}
                />
              );
            })}
            <line
              className="timelineGridEdgeRight"
              x1={timelineConfig.gridWidth}
              x2={timelineConfig.gridWidth}
              y1={0}
              y2={timelineConfig.gridHeight}
              stroke={timelineConfig.primaryColor}
              strokeWidth={1}
            ></line>
            {clientEvents.map((event) => {
              return (
                <TimelineEvent
                  onEventClick={onEventClick}
                  event={event}
                  timelineConfig={timelineConfig}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};
