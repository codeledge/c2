import { DateTime } from "luxon";
import { ReactNode, useState } from "react";
import { useElementSize } from "usehooks-ts";
import {
  TimelineEvent,
  TimelineEventProps,
  TimelineEventData,
  ClientTimelineEvent,
} from "../components/TimelineEvent";
import { TimelineGridTicks } from "../components/TimelineGridTicks";
import { TimelineRowDrawer } from "../components/TimelineRowDrawer";
import { ClientTimelineTick, TimelineTick } from "../components/TimelineTick";
import { TimelineTickBar } from "../components/TimelineTickBar";
import { getClientTimeline } from "../lib/getClientTimeline";

export type TimelineRow = {
  id?: string | number;
  name?: string;
  events: TimelineEventData[];
};

export type TimelineProps = {
  rows: TimelineRow[];
  title?: ReactNode;
  height?: number | string;
  width?: number | string;
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

export const Timeline = ({
  rows,
  options,
  height = 500,
  width = "100%",
  onEventClick,
}: TimelineProps) => {
  const [wrapperRef, { width: currentWidth, height: currentHeight }] =
    useElementSize();

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
    <div
      ref={wrapperRef}
      id="timelineWrapper"
      style={{
        backgroundColor: timelineConfig.backgroundColor,
        width,
        height,
      }}
    >
      <div id="actions">
        <button onClick={() => setZoom(timelineConfig.gridZoom + 1)}>
          Zoom in
        </button>
        <button onClick={() => setZoom(1)}>Zoom reset</button>
        <button
          disabled={timelineConfig.gridZoom <= 1}
          onClick={() => setZoom(timelineConfig.gridZoom - 1)}
        >
          Zoom out
        </button>
      </div>
      <TimelineCanvas
        rows={rows}
        timelineConfig={timelineConfig}
        onEventClick={onEventClick}
        setZoom={setZoom}
        width={currentWidth}
        height={currentHeight}
      />
    </div>
  );
};

export const TimelineCanvas = ({
  rows,
  timelineConfig,
  setZoom,
  height,
  width,
  onEventClick,
}: Omit<TimelineProps, "width" | "height"> & {
  width: number;
  height: number;
  timelineConfig: TimelineConfig;
  setZoom: any;
}) => {
  const clientTimeline = getClientTimeline(timelineConfig, rows, width, height);
  const [focusedEvent, setFocusedEvent] = useState<ClientTimelineEvent>();

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
        id="coverShape"
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
        <TimelineTickBar clientTimeline={clientTimeline} />
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
                  setFocusedEvent={setFocusedEvent}
                  focusedEvent={focusedEvent}
                />
              );
            })}
            {focusedEvent && (
              <TimelineEvent
                onEventClick={onEventClick}
                event={focusedEvent}
                clientTimeline={clientTimeline}
                setFocusedEvent={setFocusedEvent}
              />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};
