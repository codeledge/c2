import { DateTime } from "luxon";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useElementSize } from "usehooks-ts";
import {
  TimelineEventProps,
  TimelineEventData,
  ClientTimelineEvent,
} from "./components/TimelineEvent";
import { ClientTimelineRowLabel } from "./components/TimelineRowLabel";
import { ClientTimelineTick } from "./components/TimelineTick";
import { getClientTimeline } from "./lib/getClientTimeline";
import { Stage, Layer, Text, Group, Rect, Line } from "react-konva";
import { TimelineActions } from "./components/TimelineActions";
import { TimelineEventLabel } from "./components/TimelineEventLabel";

export type TimelineProps = {
  events: TimelineEventData[];
  title?: ReactNode;
  height?: number | string;
  width?: number | string;
  onEventClick?: TimelineEventProps["onEventClick"];
  options?: Partial<TimelineConfig>;
};

export type TimelineConfig = {
  backgroundColor: string;
  containerHeight: number;
  containerWidth: number;
  eventCircleRadius: number;
  eventDateFontSize: number;
  eventDateFormat: string;
  eventHeight: number;
  eventNameFontSize: number;
  eventStrokeWidth: number;
  gridMargin: number;
  gridZoom: number;
  groupBy?: string;
  minTickStepWidth: number;
  primaryColor: string;
  rowDrawerWidth: number;
  rowHeight: number;
  secondaryColor: string;
  showRowLabels: boolean;
  showEventLabels: boolean;
  showEventDates: boolean;
  ticksHeight: number;
};

export type ClientTimeline = TimelineConfig & {
  clientEvents: ClientTimelineEvent[];
  clientGroups: ClientTimelineRowLabel[];
  clientTicks: ClientTimelineTick[];
  eventsRangeMs: number;
  gridEndDateTime: DateTime;
  gridHeight: number;
  gridRangeMs: number;
  gridStartDateTime: DateTime;
  gridWidth: number;
  gridX: number;
  maxDateTime?: DateTime;
  minDateTime?: DateTime;
  scrollableWidth: number;
  scrollableHeight: number;
};

export const defaultTimelineConfig: TimelineConfig = {
  backgroundColor: "lightGrey",
  containerHeight: 0,
  containerWidth: 0,
  eventCircleRadius: 6,
  eventDateFontSize: 12,
  eventDateFormat: "yyyy-MM-dd HH:mm",
  eventHeight: 12,
  eventNameFontSize: 13,
  eventStrokeWidth: 2,
  gridMargin: 20,
  gridZoom: 1,
  minTickStepWidth: 100,
  primaryColor: "#111",
  rowDrawerWidth: 150,
  rowHeight: 50,
  secondaryColor: "grey",
  showEventDates: true,
  showEventLabels: true,
  showRowLabels: true,
  ticksHeight: 30,
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

  const updateTimelineConfig = (p: Partial<TimelineConfig>) => {
    setTimelineConfig((timelineConfig) => ({
      ...timelineConfig,
      ...p,
    }));
  };

  return (
    <>
      <TimelineActions
        timelineConfig={timelineConfig}
        updateTimelineConfig={updateTimelineConfig}
      />
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
    </>
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
  const [selectedEvent, setSelectedEvent] = useState<ClientTimelineEvent>();
  const [focusedEvent, setFocusedEvent] = useState<ClientTimelineEvent>();
  const [cursor, setCursor] = useState("default");
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

  const clientTimeline = useMemo(
    () => getClientTimeline(timelineConfig, events),
    [timelineConfig, events]
  );

  const getRowBottomY = (rowIndex: number) => {
    return clientTimeline.rowHeight * rowIndex + clientTimeline.rowHeight;
  };

  console.log(
    "clientTimeline.gridWidth - clientTimeline.scrollableWidth",
    clientTimeline.gridWidth - clientTimeline.scrollableWidth
  );

  const onScroll = (e: any) => {
    setScrollPosition(({ x, y }) => ({
      x: clamp(x + e.deltaX, {
        min: 0,
        max: clientTimeline.gridWidth - clientTimeline.containerWidth,
      }),
      y: clamp(y + e.deltaY, {
        min: 0,
        max: clientTimeline.gridHeight - clientTimeline.scrollableHeight,
      }),
    }));
  };

  return (
    <>
      <div onWheel={onScroll}>
        <Stage
          width={clientTimeline.containerWidth}
          height={clientTimeline.containerHeight}
          style={{
            cursor,
          }}
        >
          <Layer
            id="grid"
            x={clientTimeline.gridX - scrollPosition.x}
            y={clientTimeline.ticksHeight}
          >
            <Group id="scrollableGrid" y={-scrollPosition.y}>
              <Line
                className="borderLeft"
                points={[0, 0, 0, clientTimeline.gridHeight]}
                stroke={clientTimeline.secondaryColor}
                strokeWidth={1}
              />
              {clientTimeline.clientTicks.map((tick) => {
                return (
                  <Line
                    className="tickGridVerticalDottedLine"
                    points={[tick.x, 0, tick.x, clientTimeline.gridHeight]}
                    stroke={clientTimeline.secondaryColor}
                    strokeWidth={1}
                    dash={[4, 4]}
                  />
                );
              })}
              <Line
                className="borderRight"
                points={[
                  clientTimeline.gridWidth,
                  0,
                  clientTimeline.gridWidth,
                  clientTimeline.gridHeight,
                ]}
                stroke={clientTimeline.secondaryColor}
                strokeWidth={1}
              />
              {clientTimeline.clientGroups.map((group, groupIndex) => {
                return (
                  <Line
                    key={group.name}
                    className="timelineGridRowBottomLine"
                    points={[
                      0,
                      getRowBottomY(groupIndex),
                      clientTimeline.gridWidth,
                      getRowBottomY(groupIndex),
                    ]}
                    stroke={clientTimeline.secondaryColor}
                    strokeWidth={1}
                  />
                );
              })}
              {clientTimeline.clientEvents.map((event) => {
                return (
                  <Group
                    key={event.id}
                    // opacity={0.5}
                    onMouseEnter={() => {
                      setCursor("pointer");
                    }}
                    onMouseLeave={() => {
                      setCursor("default");
                    }}
                  >
                    {event.name && clientTimeline.showEventLabels && (
                      <TimelineEventLabel
                        event={event}
                        clientTimeline={clientTimeline}
                      />
                    )}
                    <Rect
                      x={
                        (event.startX || event.x) -
                        clientTimeline.eventCircleRadius
                      }
                      y={event.y - clientTimeline.eventCircleRadius}
                      width={
                        event.endX && event.startX
                          ? event.endX -
                            event.startX +
                            2 * clientTimeline.eventCircleRadius
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
                    {clientTimeline.showEventDates && (
                      <Text
                        y={event.y + clientTimeline.eventCircleRadius + 4}
                        x={event.x}
                        align="center"
                        offsetX={100}
                        width={200}
                        fontFamily="helvetica"
                        color={clientTimeline.primaryColor}
                        fontSize={12}
                        wrap="none"
                        text={
                          event.startDateTime && event.endDateTime
                            ? `${event.startDateTime?.toFormat(
                                clientTimeline.eventDateFormat
                              )} ~ ${event.endDateTime?.toFormat(
                                clientTimeline.eventDateFormat
                              )}`
                            : event.dateTime?.toFormat(
                                clientTimeline.eventDateFormat
                              )
                        }
                      />
                    )}
                  </Group>
                );
              })}
            </Group>
          </Layer>
          <Layer x={-scrollPosition.x}>
            <Rect
              width={clientTimeline.containerWidth}
              height={clientTimeline.ticksHeight}
              fill={clientTimeline.backgroundColor}
            />
            <Group
              id="stickyTicker"
              x={clientTimeline.gridX}
              y={clientTimeline.ticksHeight}
            >
              {clientTimeline.clientTicks.map((clientTick) => {
                return (
                  <Group key={clientTick.x}>
                    <Text
                      x={clientTick.x}
                      y={-18}
                      fontSize={12}
                      fontFamily="helvetica"
                      align="center"
                      width={clientTimeline.minTickStepWidth}
                      offsetX={clientTimeline.minTickStepWidth / 2}
                      fill={clientTimeline.primaryColor}
                      text={clientTick.label}
                    />
                    <Line
                      points={[clientTick.x, 0, clientTick.x, -5]}
                      stroke={clientTimeline.secondaryColor}
                      strokeWidth={1}
                    />
                  </Group>
                );
              })}
              <Line
                className="tickerBottom"
                points={[-0.5, 0, clientTimeline.gridWidth + 0.5, 0]}
                stroke={clientTimeline.secondaryColor}
                strokeWidth={1}
              />
            </Group>
          </Layer>
          <Layer id="rowLabels" y={clientTimeline.ticksHeight}>
            {clientTimeline.showRowLabels && (
              <Group id="stickyRowLabels" y={-scrollPosition.y}>
                <Rect
                  height={clientTimeline.gridHeight}
                  width={clientTimeline.rowDrawerWidth}
                  fill={clientTimeline.backgroundColor}
                />
                <Line
                  className="borderRight"
                  points={[
                    clientTimeline.rowDrawerWidth,
                    0,
                    clientTimeline.rowDrawerWidth,
                    clientTimeline.gridHeight,
                  ]}
                  stroke={clientTimeline.secondaryColor}
                  strokeWidth={1}
                />
                {clientTimeline.clientGroups.map((group) => {
                  return (
                    <Group
                      key={group.name}
                      y={group.index * clientTimeline.rowHeight}
                      width={clientTimeline.rowDrawerWidth}
                    >
                      <Text
                        align="right"
                        text={group.name}
                        fontSize={14}
                        width={clientTimeline.rowDrawerWidth - 10}
                        height={clientTimeline.rowHeight}
                        verticalAlign="middle"
                      />
                    </Group>
                  );
                })}
              </Group>
            )}
          </Layer>
        </Stage>
      </div>
    </>
  );
};

// get from dev
export const clamp = (
  number: number,
  { min, max }: { min: number; max: number }
) => {
  if (number < min) {
    return min;
  }

  if (number > max && max > min) {
    return max;
  }

  return number;
};
