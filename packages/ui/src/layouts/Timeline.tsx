import { DateTime } from "luxon";
import { ReactNode } from "react";
import {
  TimelineEvent,
  TimelineEventProps,
  TimelineEventData,
  ClientTimelineEvent,
} from "../components/TimelineEvent";
import { TimelineTick } from "../components/TimelineTick";
import { getClientTimeline } from "../lib/getClientTimeline";

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
  gridZoom: number;
  primaryColor: string;
  rowDrawerWidth: number;
  rowHeight: number;
  secondaryColor: string;
  tickDensity: number;
  ticksHeight: number;
};

export type ClientTimeline = TimelineConfig & {
  gridHeight: number;
  gridWidth: number;
  height: number;
  width: number;
  clientEvents: ClientTimelineEvent[];
  eventsDurationMilliseconds: number;
  gridDurationMilliseconds: number;
  gridEndDateTime: DateTime;
  maxDateTime?: DateTime;
  gridStartDateTime: DateTime;
  minDateTime?: DateTime;
  ticks: TimelineTick[];
};

export const defaultTimelineConfig: TimelineConfig = {
  backgroundColor: "lightGrey",
  gridZoom: 1,
  primaryColor: "grey",
  rowDrawerWidth: 150,
  rowHeight: 50,
  secondaryColor: "grey",
  tickDensity: 10,
  ticksHeight: 30,
};

export const Timeline = ({ rows, options, onEventClick }: TimelineProps) => {
  const timelineConfig: TimelineConfig = {
    ...defaultTimelineConfig,
    ...options,
  };

  const clientTimeline = getClientTimeline(timelineConfig, rows);

  const getRowBottomY = (rowIndex: number) => {
    return clientTimeline.rowHeight * rowIndex + clientTimeline.rowHeight;
  };

  return (
    <div
      style={{
        backgroundColor: clientTimeline.backgroundColor,
        position: "relative",
        height: clientTimeline.height,
        width: clientTimeline.width,
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
          height: clientTimeline.height,
          width: clientTimeline.width,
        }}
      >
        <div
          id="tick-wrapper"
          style={{
            position: "sticky",
            top: 0,
            paddingLeft: clientTimeline.rowDrawerWidth,
            background: clientTimeline.backgroundColor,
            height: clientTimeline.ticksHeight,
            width: clientTimeline.gridWidth,
          }}
        >
          <svg
            width={clientTimeline.gridWidth}
            height={clientTimeline.ticksHeight}
          >
            <g
              id="ticks"
              transform={`translate(0 ${clientTimeline.ticksHeight})`}
            >
              {clientTimeline.ticks.map((tick) => {
                return (
                  <g key={tick.x}>
                    <text
                      x={tick.x}
                      y={-10}
                      fontSize={9}
                      textAnchor="middle"
                      fill={clientTimeline.primaryColor}
                    >
                      {tick.label}
                    </text>
                    <line
                      x1={tick.x}
                      y1={0}
                      x2={tick.x}
                      y2={-5}
                      stroke={clientTimeline.primaryColor}
                    />
                  </g>
                );
              })}
              <line
                className="tickerBottom"
                x1={0}
                x2={clientTimeline.gridWidth}
                y1={0}
                y2={0}
                stroke={clientTimeline.primaryColor}
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
              flex: `0 0 ${clientTimeline.rowDrawerWidth}px`,
              background: clientTimeline.backgroundColor,
              borderRight: `1px solid ${clientTimeline.primaryColor}`,
              boxSizing: "border-box",
            }}
          >
            {rows.map((row, rowIndex) => {
              return (
                <div
                  style={{
                    height: clientTimeline.rowHeight,
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
            width={clientTimeline.gridWidth}
            height={clientTimeline.gridHeight}
            style={{
              flex: `0 0 ${clientTimeline.gridWidth}px`,
            }}
          >
            {clientTimeline.ticks.slice(1).map((tick) => {
              return (
                <g key={tick.x}>
                  <line
                    className="tickerDottedLine"
                    x1={tick.x}
                    x2={tick.x}
                    y1={0}
                    y2={clientTimeline.gridHeight}
                    stroke={clientTimeline.primaryColor}
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
                  x2={clientTimeline.gridWidth}
                  y1={getRowBottomY(rowIndex)}
                  y2={getRowBottomY(rowIndex)}
                  stroke={clientTimeline.primaryColor}
                  strokeWidth={1}
                />
              );
            })}
            <line
              className="timelineGridEdgeRight"
              x1={clientTimeline.gridWidth}
              x2={clientTimeline.gridWidth}
              y1={0}
              y2={clientTimeline.gridHeight}
              stroke={clientTimeline.primaryColor}
              strokeWidth={1}
            ></line>
            {clientTimeline.clientEvents.map((event) => {
              return (
                <TimelineEvent
                  onEventClick={onEventClick}
                  event={event}
                  clientTimeline={clientTimeline}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};
