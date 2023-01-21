import { DateTime } from "luxon";
import { ReactNode, useState } from "react";
import {
  TimelineEvent,
  TimelineEventProps,
  TimelineEventData,
  ClientTimelineEvent,
} from "../components/TimelineEvent";
import { TimelineGridTicks } from "../components/TimelineGridTicks";
import { TimelineRowDrawer } from "../components/TimelineRowDrawer";
import { ClientTimelineTick, TimelineTick } from "../components/TimelineTick";
import { getClientTimeline } from "../lib/getClientTimeline";

export type TimelineRow = {
  id?: string | number;
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
  eventDateFormat: string;
  eventStrokeWidth: number;
  gridMarginRight: number;
};

export type ClientTimeline = TimelineConfig & {
  gridHeight: number;
  gridWidth: number;
  height: number;
  width: number;
  clientEvents: ClientTimelineEvent[];
  clientRows: TimelineRow[];
  eventsDurationMilliseconds: number;
  gridDurationMilliseconds: number;
  gridEndDateTime: DateTime;
  maxDateTime?: DateTime;
  gridStartDateTime: DateTime;
  minDateTime?: DateTime;
  clientTicks: ClientTimelineTick[];
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
  eventDateFormat: "yyyy-MM-dd HH:mm",
  eventStrokeWidth: 2,
  gridMarginRight: 10,
};

export const Timeline = ({ rows, options, onEventClick }: TimelineProps) => {
  const [timelineConfig, setTimelineConfig] = useState<TimelineConfig>({
    ...defaultTimelineConfig,
    ...options,
  });

  const setZoom = (zoom: number) => {
    setTimelineConfig((timelineConfig) => ({
      ...timelineConfig,
      gridZoom: Math.max(zoom, 1),
    }));
  };

  return (
    <TimelineCanvas
      rows={rows}
      timelineConfig={timelineConfig}
      onEventClick={onEventClick}
      setZoom={setZoom}
    />
  );
};

export const TimelineCanvas = ({
  rows,
  timelineConfig,
  setZoom,
  onEventClick,
}: TimelineProps & { timelineConfig: TimelineConfig; setZoom: any }) => {
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
      >
        <button onClick={() => setZoom(clientTimeline.gridZoom + 1)}>
          Zoom in
        </button>
        <button
          disabled={clientTimeline.gridZoom <= 1}
          onClick={() => setZoom(clientTimeline.gridZoom - 1)}
        >
          Zoom out
        </button>
      </div>
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
              {clientTimeline.clientTicks.map((clientTick) => {
                return (
                  <TimelineTick
                    key={clientTick.x}
                    clientTick={clientTick}
                    clientTimeline={clientTimeline}
                  />
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
            width: clientTimeline.gridWidth,
          }}
        >
          <TimelineRowDrawer clientTimeline={clientTimeline} />
          <svg
            width={clientTimeline.gridWidth}
            height={clientTimeline.gridHeight}
            style={{
              flex: `0 0 ${clientTimeline.gridWidth}px`,
            }}
          >
            <defs>
              <filter x="0" y="0" width="1" height="1" id="labelBackground">
                <feFlood
                  flood-color={clientTimeline.backgroundColor}
                  result="bg"
                />
                <feMerge>
                  <feMergeNode in="bg" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <TimelineGridTicks clientTimeline={clientTimeline} />
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
