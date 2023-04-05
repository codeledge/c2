import { DateTime } from "luxon";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useElementSize } from "usehooks-ts";
import {
  TimelineEvent,
  TimelineEventProps,
  TimelineEventData,
  ClientTimelineEvent,
} from "./components/TimelineEvent";
import { TimelineGridTicks } from "./components/TimelineGridTicks";
import { ClientTimelineGroup } from "./components/TimelineGroup";
import { TimelineRowDrawer } from "./components/TimelineRowDrawer";
import { ClientTimelineTick } from "./components/TimelineTick";
import { TimelineTickBar } from "./components/TimelineTickBar";
import { getClientTimeline } from "./lib/getClientTimeline";
import { Stage, Layer, Text, Group, Rect } from "react-konva";
import { TimelineActions } from "./components/TimelineActions";

export type TimelineProps = {
  events: TimelineEventData[];
  title?: ReactNode;
  height?: number | string;
  width?: number | string;
  onEventClick?: TimelineEventProps["onEventClick"];
  options?: Partial<TimelineConfig>;
};

export type TimelineConfig = {
  actionsHeight: number;
  backgroundColor: string;
  containerWidth?: number;
  containerHeight?: number;
  eventDateFormat: string;
  eventStrokeWidth: number;
  eventHeight: number;
  eventNameFontSize: number;
  eventDateFontSize: number;
  eventCircleRadius: number;
  gridMarginRight: number;
  gridZoom: number;
  groupBy?: string;
  minTickStepWidth: number;
  primaryColor: string;
  rowDrawerWidth: number;
  rowHeight: number;
  secondaryColor: string;
  ticksHeight: number;
};

export type ClientTimeline = TimelineConfig & {
  clientEvents: ClientTimelineEvent[];
  clientGroups: ClientTimelineGroup[];
  clientTicks: ClientTimelineTick[];
  eventsRangeMs: number;
  gridEndDateTime: DateTime;
  gridHeight: number;
  gridRangeMs: number;
  gridStartDateTime: DateTime;
  gridWidth: number;
  maxDateTime?: DateTime;
  minDateTime?: DateTime;
  scrollableHeight: number;
};

export const defaultTimelineConfig: TimelineConfig = {
  actionsHeight: 50,
  backgroundColor: "lightGrey",
  gridZoom: 1,
  primaryColor: "#111",
  eventNameFontSize: 13,
  eventDateFontSize: 12,
  eventCircleRadius: 6,
  eventHeight: 12,
  rowDrawerWidth: 150,
  rowHeight: 50,
  secondaryColor: "grey",
  minTickStepWidth: 100,
  ticksHeight: 30,
  eventDateFormat: "yyyy-MM-dd HH:mm",
  eventStrokeWidth: 2,
  gridMarginRight: 20,
};

export const SvgTimeline = ({
  events,
  options,
  height = 500,
  width = "100%",
  onEventClick,
}: TimelineProps) => {
  const [wrapperRef, { width: containerWidth, height: containerHeight }] =
    useElementSize();

  const [timelineConfig, setTimelineConfig] = useState<TimelineConfig>({
    ...defaultTimelineConfig,
    ...options,
  });

  useEffect(() => {
    setTimelineConfig((timelineConfig) => ({
      ...timelineConfig,
      containerWidth,
      containerHeight,
    }));
  }, [containerWidth, containerHeight]);

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
      {containerHeight && ( // wrapperRef not ready yet
        <SvgTimelineArea
          events={events}
          setTimelineConfig={setTimelineConfig}
          timelineConfig={timelineConfig}
          onEventClick={onEventClick}
        />
      )}
    </div>
  );
};

export const SvgTimelineArea = ({
  events,
  timelineConfig,
  onEventClick,
  setTimelineConfig,
}: Omit<TimelineProps, "width" | "height"> & {
  timelineConfig: TimelineConfig;
  setTimelineConfig: React.Dispatch<React.SetStateAction<TimelineConfig>>;
}) => {
  const setZoom = (zoom: number) => {
    setTimelineConfig((timelineConfig) => ({
      ...timelineConfig,
      gridZoom: Math.max(zoom, 1),
    }));
  };

  const [selectedEvent, setSelectedEvent] = useState<ClientTimelineEvent>();

  const clientTimeline = useMemo(
    () => getClientTimeline(timelineConfig, events),
    [timelineConfig, events]
  );
  const [focusedEvent, setFocusedEvent] = useState<ClientTimelineEvent>();

  const getRowBottomY = (rowIndex: number) => {
    return clientTimeline.rowHeight * rowIndex + clientTimeline.rowHeight;
  };

  return (
    <>
      <TimelineActions clientTimeline={clientTimeline} setZoom={setZoom} />
      <div
        id="scrollable"
        style={{
          overflow: "auto",
          position: "relative",
          height: clientTimeline.scrollableHeight,
          width: "100%",
        }}
      >
        <TimelineTickBar clientTimeline={clientTimeline} />
        <div
          id="grid-wrapper"
          style={{
            display: "flex",
            width: "100%",
          }}
        >
          <svg
            style={{
              position: "absolute",
            }}
            width={clientTimeline.containerWidth}
            height={clientTimeline.gridHeight}
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
            <g
              id="grid"
              transform={`translate(${clientTimeline.rowDrawerWidth} 0)`}
            >
              <TimelineGridTicks clientTimeline={clientTimeline} />
              {clientTimeline.clientGroups.map((group, groupIndex) => {
                return (
                  <line
                    key={group.name}
                    className="timelineGridRowBottomLine"
                    x1={0}
                    x2={clientTimeline.gridWidth}
                    y1={getRowBottomY(groupIndex)}
                    y2={getRowBottomY(groupIndex)}
                    stroke={clientTimeline.primaryColor}
                    strokeWidth={1}
                  />
                );
              })}
              {clientTimeline.clientEvents.map((event) => {
                return (
                  <TimelineEvent
                    key={event.id}
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
            </g>
          </svg>
          <TimelineRowDrawer clientTimeline={clientTimeline} />
        </div>
      </div>
    </>
  );
};

export const CanvasTimeline = ({
  events,
  options,
  onEventClick,
  height = 500,
  width = "100%",
}: TimelineProps) => {
  const [wrapperRef, { width: containerWidth, height: containerHeight }] =
    useElementSize();

  const [timelineConfig, setTimelineConfig] = useState<TimelineConfig>({
    ...defaultTimelineConfig,
    ...options,
  });

  useEffect(() => {
    setTimelineConfig((timelineConfig) => ({
      ...timelineConfig,
      containerWidth,
      containerHeight,
    }));
  }, [containerWidth, containerHeight]);

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
      {timelineConfig.containerWidth &&
        timelineConfig.containerHeight && ( // wrapperRef not ready yet
          <CanvasTimelineArea
            events={events}
            timelineConfig={timelineConfig}
            setTimelineConfig={setTimelineConfig}
            onEventClick={onEventClick}
          />
        )}
    </div>
  );
};

export const CanvasTimelineArea = ({
  events,
  timelineConfig,
  setTimelineConfig,
}: Omit<TimelineProps, "width" | "height"> & {
  timelineConfig: TimelineConfig;
  setTimelineConfig: React.Dispatch<React.SetStateAction<TimelineConfig>>;
}) => {
  const setZoom = (zoom: number) => {
    setTimelineConfig((timelineConfig) => ({
      ...timelineConfig,
      gridZoom: Math.max(zoom, 1),
    }));
  };

  const [selectedEvent, setSelectedEvent] = useState<ClientTimelineEvent>();

  const clientTimeline = useMemo(
    () => getClientTimeline(timelineConfig, events),
    [timelineConfig, events]
  );
  const [focusedEvent, setFocusedEvent] = useState<ClientTimelineEvent>();

  const getRowBottomY = (rowIndex: number) => {
    return clientTimeline.rowHeight * rowIndex + clientTimeline.rowHeight;
  };

  return (
    <>
      <TimelineActions clientTimeline={clientTimeline} setZoom={setZoom} />
      <div
        id="scrollable"
        style={{
          overflow: "auto",
          position: "relative",
          height: clientTimeline.scrollableHeight,
          width: "100%",
        }}
      >
        <TimelineTickBar clientTimeline={clientTimeline} />
        <div
          id="gridWrapper"
          style={{
            display: "flex",
            width: clientTimeline.containerWidth,
          }}
        >
          <TimelineRowDrawer clientTimeline={clientTimeline} />
          <svg
            style={{
              position: "absolute",
            }}
            width={clientTimeline.containerWidth}
            height={clientTimeline.gridHeight}
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
            <g
              id="grid"
              transform={`translate(${clientTimeline.rowDrawerWidth} 0)`}
            >
              <TimelineGridTicks clientTimeline={clientTimeline} />
              {clientTimeline.clientGroups.map((group, groupIndex) => {
                return (
                  <line
                    key={group.name}
                    className="timelineGridRowBottomLine"
                    x1={0}
                    x2={clientTimeline.gridWidth}
                    y1={getRowBottomY(groupIndex)}
                    y2={getRowBottomY(groupIndex)}
                    stroke={clientTimeline.primaryColor}
                    strokeWidth={1}
                  />
                );
              })}
            </g>
          </svg>
          <Stage
            width={clientTimeline.gridWidth}
            height={clientTimeline.gridHeight}
            style={{
              cursor: "pointer",
            }}
          >
            <Layer>
              {clientTimeline.clientEvents.map((event) => {
                return (
                  <Group key={event.id}>
                    {event.name && (
                      <Text
                        // filter="url(#labelBackground)"
                        y={
                          event.y -
                          clientTimeline.eventCircleRadius -
                          clientTimeline.eventNameFontSize -
                          2
                        }
                        x={event.x}
                        fontFamily="helvetica"
                        align="left"
                        fill={clientTimeline.primaryColor}
                        // offsetX={50}
                        width={100}
                        ellipsis={true}
                        wrap="none"
                        verticalAlign="bottom"
                        fontSize={clientTimeline.eventNameFontSize}
                        text={event.name}
                      />
                    )}
                    <Rect
                      x={
                        (event.startX || event.x) -
                        clientTimeline.eventCircleRadius +
                        clientTimeline.eventStrokeWidth / 2
                      }
                      y={event.y - clientTimeline.eventCircleRadius}
                      width={
                        event.endX && event.startX
                          ? event.endX -
                            event.startX +
                            2 * clientTimeline.eventCircleRadius -
                            clientTimeline.eventStrokeWidth / 4
                          : 2 * clientTimeline.eventCircleRadius
                      }
                      height={clientTimeline.eventHeight}
                      onMouseEnter={(e) => {
                        // e.container().style.cursor = "pointer";
                      }}
                      fill={
                        !event.groupLabel
                          ? clientTimeline.backgroundColor
                          : clientTimeline.primaryColor
                      }
                      cornerRadius={clientTimeline.eventCircleRadius}
                      stroke={clientTimeline.primaryColor}
                      strokeWidth={clientTimeline.eventStrokeWidth}
                    />
                  </Group>
                );
              })}
            </Layer>
          </Stage>
        </div>
      </div>
    </>
  );
};
