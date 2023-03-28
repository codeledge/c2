var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};

// src/Timeline.tsx
import { useState } from "react";
import { useElementSize } from "usehooks-ts";

// src/components/TimelineEvent.tsx
import { getElongatedCirclePathD } from "@c2/core";
import { jsx, jsxs } from "react/jsx-runtime";
var eventCircleRadius = 5;
var eventDateFontSize = 12;
var eventNameFontSize = 13;
var TimelineEvent = (_a) => {
  var _b = _a, {
    event,
    onEventClick,
    clientTimeline,
    setFocusedEvent,
    focusedEvent
  } = _b, props = __objRest(_b, [
    "event",
    "onEventClick",
    "clientTimeline",
    "setFocusedEvent",
    "focusedEvent"
  ]);
  var _a2, _b2, _c;
  return /* @__PURE__ */ jsxs(
    "g",
    {
      transform: `translate(${event.x},${event.y})`,
      style: {
        opacity: (focusedEvent == null ? void 0 : focusedEvent.id) ? 0.2 : 1
      },
      onClick: onEventClick ? () => onEventClick(event) : void 0,
      cursor: onEventClick ? "pointer" : void 0,
      onMouseEnter: () => {
        setFocusedEvent == null ? void 0 : setFocusedEvent(event);
      },
      onMouseLeave: () => {
        setFocusedEvent == null ? void 0 : setFocusedEvent(void 0);
      },
      tabIndex: 1,
      children: [
        event.name && /* @__PURE__ */ jsx(
          "text",
          {
            filter: "url(#labelBackground)",
            dy: -eventNameFontSize + 1,
            textAnchor: "middle",
            fontFamily: "helvetica",
            color: clientTimeline.primaryColor,
            fontSize: eventNameFontSize,
            children: event.name
          }
        ),
        event.startX && event.endX ? /* @__PURE__ */ jsx(
          "path",
          __spreadValues({
            d: getElongatedCirclePathD(
              { x: event.startX - event.x, y: 0 },
              { x: event.endX - event.x, y: 0 },
              eventCircleRadius
            ),
            fill: clientTimeline.backgroundColor,
            stroke: clientTimeline.primaryColor,
            strokeWidth: clientTimeline.eventStrokeWidth
          }, props)
        ) : /* @__PURE__ */ jsx(
          "circle",
          __spreadValues({
            cx: 0,
            cy: 0,
            r: eventCircleRadius,
            fill: clientTimeline.backgroundColor,
            stroke: clientTimeline.primaryColor,
            strokeWidth: clientTimeline.eventStrokeWidth
          }, props)
        ),
        /* @__PURE__ */ jsx(
          "text",
          {
            filter: "url(#labelBackground)",
            dy: eventCircleRadius + eventDateFontSize + 2,
            textAnchor: "middle",
            fontFamily: "helvetica",
            color: clientTimeline.primaryColor,
            fontSize: 12,
            children: event.startDateTime && event.endDateTime ? `${(_a2 = event.startDateTime) == null ? void 0 : _a2.toFormat(
              clientTimeline.eventDateFormat
            )} - ${(_b2 = event.endDateTime) == null ? void 0 : _b2.toFormat(clientTimeline.eventDateFormat)}` : (_c = event.dateTime) == null ? void 0 : _c.toFormat(clientTimeline.eventDateFormat)
          }
        )
      ]
    }
  );
};

// src/components/TimelineGridTicks.tsx
import { Fragment, jsx as jsx2 } from "react/jsx-runtime";
var TimelineGridTicks = ({
  clientTimeline
}) => {
  return /* @__PURE__ */ jsx2(Fragment, { children: clientTimeline.clientTicks.slice(1).map((tick) => {
    return /* @__PURE__ */ jsx2("g", { children: /* @__PURE__ */ jsx2(
      "line",
      {
        className: "tickerDottedLine",
        x1: tick.x,
        x2: tick.x,
        y1: 0,
        y2: clientTimeline.gridHeight,
        stroke: clientTimeline.primaryColor,
        strokeWidth: 1,
        strokeDasharray: "5,5"
      }
    ) }, tick.x);
  }) });
};

// src/components/TimelineRowDrawer.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
var TimelineRowDrawer = ({
  clientTimeline
}) => {
  return /* @__PURE__ */ jsx3(
    "div",
    {
      style: {
        position: "sticky",
        left: 0,
        flex: `0 0 ${clientTimeline.rowDrawerWidth}px`,
        background: clientTimeline.backgroundColor,
        borderRight: `1px solid ${clientTimeline.primaryColor}`,
        boxSizing: "border-box"
      },
      children: clientTimeline.clientGroups.map((group) => {
        return /* @__PURE__ */ jsx3(
          "div",
          {
            style: {
              height: clientTimeline.rowHeight,
              width: "100%"
            },
            children: /* @__PURE__ */ jsx3(
              "div",
              {
                style: {
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: 10
                },
                children: /* @__PURE__ */ jsx3("p", { style: { textAlign: "right" }, children: group.name })
              }
            )
          },
          group.name
        );
      })
    }
  );
};

// src/components/TimelineTick.tsx
import { jsx as jsx4, jsxs as jsxs2 } from "react/jsx-runtime";
var TimelineTick = ({
  clientTick,
  clientTimeline
}) => {
  return /* @__PURE__ */ jsxs2("g", { children: [
    /* @__PURE__ */ jsx4(
      "text",
      {
        x: clientTick.x,
        y: -10,
        fontSize: 9,
        textAnchor: "middle",
        fill: clientTimeline.primaryColor,
        children: clientTick.label
      }
    ),
    /* @__PURE__ */ jsx4(
      "line",
      {
        x1: clientTick.x,
        y1: 0,
        x2: clientTick.x,
        y2: -5,
        stroke: clientTimeline.primaryColor
      }
    )
  ] }, clientTick.x);
};

// src/components/TimelineTickBar.tsx
import { jsx as jsx5, jsxs as jsxs3 } from "react/jsx-runtime";
var TimelineTickBar = ({
  clientTimeline
}) => {
  return /* @__PURE__ */ jsx5(
    "div",
    {
      id: "tick-wrapper",
      style: {
        position: "sticky",
        top: 0,
        paddingLeft: clientTimeline.rowDrawerWidth,
        background: clientTimeline.backgroundColor,
        height: clientTimeline.ticksHeight,
        width: clientTimeline.gridWidth
      },
      children: /* @__PURE__ */ jsx5("svg", { width: clientTimeline.gridWidth, height: clientTimeline.ticksHeight, children: /* @__PURE__ */ jsxs3("g", { id: "ticks", transform: `translate(0 ${clientTimeline.ticksHeight})`, children: [
        clientTimeline.clientTicks.map((clientTick) => {
          return /* @__PURE__ */ jsx5(
            TimelineTick,
            {
              clientTick,
              clientTimeline
            },
            clientTick.x
          );
        }),
        /* @__PURE__ */ jsx5(
          "line",
          {
            className: "tickerBottom",
            x1: 0,
            x2: clientTimeline.gridWidth,
            y1: 0,
            y2: 0,
            stroke: clientTimeline.primaryColor,
            strokeWidth: 1
          }
        )
      ] }) })
    }
  );
};

// src/lib/getClientTimeline.ts
import {
  parseDateTime,
  MILLISECONDS_IN_DECADE,
  MILLISECONDS_IN_YEAR,
  MILLISECONDS_IN_MONTH
} from "@c2/core";
var getClientTimeline = (timelineConfig, events, containerWidth, containerHeight) => {
  const gridWidth = (containerWidth - timelineConfig.rowDrawerWidth) * timelineConfig.gridZoom;
  let minDateTime;
  let maxDateTime;
  const groupMap = {};
  let clientEvents = events.reduce((events2, event) => {
    if (!event.date && !(event.startDate && event.endDate)) {
      console.log("skipped event", event);
      return events2;
    }
    let dateTime = parseDateTime(event.date);
    const startDateTime = parseDateTime(event.startDate);
    const endDateTime = parseDateTime(event.endDate);
    if (!dateTime && startDateTime && endDateTime) {
      dateTime = endDateTime.minus({
        milliseconds: endDateTime.diff(startDateTime).as("milliseconds") / 2
      });
    }
    if (!minDateTime) {
      minDateTime = startDateTime || dateTime;
    }
    if (!maxDateTime) {
      maxDateTime = dateTime || endDateTime;
    }
    if (dateTime && dateTime < minDateTime) {
      minDateTime = dateTime;
    }
    if (startDateTime && startDateTime < minDateTime) {
      minDateTime = startDateTime;
    }
    if (dateTime && dateTime > maxDateTime) {
      maxDateTime = dateTime;
    }
    if (endDateTime && endDateTime > maxDateTime) {
      maxDateTime = endDateTime;
    }
    let groupIndex = 0;
    if (timelineConfig.groupBy) {
      const groupKey = event[timelineConfig.groupBy];
      if (!groupMap[groupKey]) {
        groupIndex = Object.keys(groupMap).length;
        groupMap[groupKey] = {
          name: groupKey,
          index: groupIndex
        };
      } else {
        groupIndex = groupMap[groupKey].index;
      }
    } else {
      groupIndex = 0;
      groupMap[""] = {
        name: "Ungrouped",
        index: groupIndex
      };
    }
    return events2.concat(__spreadProps(__spreadValues({}, event), {
      x: -1,
      y: groupIndex * timelineConfig.rowHeight + timelineConfig.rowHeight / 2,
      dateTime,
      startDateTime,
      endDateTime
    }));
  }, []);
  console.log({ minDateTime, maxDateTime, groupMap });
  const eventsDurationMilliseconds = maxDateTime.diff(minDateTime).as("milliseconds") || 1e7;
  const gridDurationPaddingMilliseconds = eventsDurationMilliseconds * 0.1;
  const gridResolution = getGridResolution(eventsDurationMilliseconds);
  const gridStartDateTime = minDateTime.minus({ milliseconds: gridDurationPaddingMilliseconds }).startOf(gridResolutionToDuration(gridResolution));
  const gridEndDateTime = maxDateTime.plus({ milliseconds: gridDurationPaddingMilliseconds }).endOf(gridResolutionToDuration(gridResolution));
  const gridDurationMilliseconds = gridEndDateTime.diff(gridStartDateTime).as("milliseconds");
  console.log({ gridStartDateTime, gridEndDateTime, gridDurationMilliseconds });
  clientEvents = clientEvents.map((event) => {
    return __spreadProps(__spreadValues({}, event), {
      x: getGridPositonX(
        event.dateTime,
        gridStartDateTime,
        gridDurationMilliseconds,
        gridWidth
      ),
      startX: event.startDateTime ? getGridPositonX(
        event.startDateTime,
        gridStartDateTime,
        gridDurationMilliseconds,
        gridWidth
      ) : void 0,
      endX: event.endDateTime ? getGridPositonX(
        event.endDateTime,
        gridStartDateTime,
        gridDurationMilliseconds,
        gridWidth
      ) : void 0
    });
  });
  clientEvents.sort(
    (a, b) => (a.startDateTime || a.dateTime).diff(b.startDateTime || b.dateTime).as("milliseconds")
  );
  const contextualDiff = gridEndDateTime.diff(gridStartDateTime).as("years");
  const numberOfTicks = Math.ceil(gridWidth / timelineConfig.tickDensity);
  const clientTicks = Array.from({ length: numberOfTicks + 1 }, (_, i) => {
    const x = i / numberOfTicks * gridWidth;
    const tickDateMilliseconds = i / numberOfTicks * gridDurationMilliseconds;
    return {
      x,
      label: gridStartDateTime.plus({ milliseconds: tickDateMilliseconds }).toFormat(gridResolutionToFormat(gridResolution))
    };
  });
  return __spreadProps(__spreadValues({}, timelineConfig), {
    gridHeight: timelineConfig.rowHeight * Object.keys(groupMap).length,
    gridWidth,
    width: containerWidth,
    height: containerHeight,
    clientEvents,
    clientGroups: Object.values(groupMap),
    eventsDurationMilliseconds,
    gridDurationMilliseconds,
    gridEndDateTime,
    maxDateTime,
    gridStartDateTime,
    minDateTime,
    clientTicks
  });
};
var gridResolutionToDuration = (gridResolution) => {
  switch (gridResolution) {
    case "YEAR" /* YEAR */:
      return "year";
    default:
      return "minute";
  }
};
var gridResolutionToFormat = (gridResolution) => {
  switch (gridResolution) {
    case "YEAR" /* YEAR */:
      return "yyyy";
    default:
      return "yyyy-MM-dd";
  }
};
var getGridResolution = (eventsDurationMilliseconds) => {
  return eventsDurationMilliseconds > MILLISECONDS_IN_DECADE ? "YEAR" /* YEAR */ : eventsDurationMilliseconds > MILLISECONDS_IN_YEAR ? "MONTH" /* MONTH */ : eventsDurationMilliseconds > MILLISECONDS_IN_MONTH ? "DAY" /* DAY */ : "HOUR" /* HOUR */;
};
var getGridPositonX = (dateTime, gridStartDateTime, gridDurationMilliseconds, gridWidth) => {
  return dateTime.diff(gridStartDateTime).as("milliseconds") / gridDurationMilliseconds * gridWidth;
};

// src/Timeline.tsx
import { jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
var defaultTimelineConfig = {
  backgroundColor: "lightGrey",
  gridZoom: 1,
  primaryColor: "grey",
  rowDrawerWidth: 150,
  rowHeight: 50,
  secondaryColor: "grey",
  tickDensity: 100,
  ticksHeight: 30,
  eventDateFormat: "yyyy-MM-dd HH:mm",
  eventStrokeWidth: 2,
  gridMarginRight: 10
};
var Timeline = ({
  events,
  options,
  height = 500,
  width = "100%",
  onEventClick
}) => {
  const [wrapperRef, { width: currentWidth, height: currentHeight }] = useElementSize();
  const [timelineConfig, setTimelineConfig] = useState(__spreadValues(__spreadValues({}, defaultTimelineConfig), options));
  const setZoom = (zoom) => {
    setTimelineConfig((timelineConfig2) => __spreadProps(__spreadValues({}, timelineConfig2), {
      gridZoom: Math.max(zoom, 1)
    }));
  };
  return /* @__PURE__ */ jsxs4(
    "div",
    {
      ref: wrapperRef,
      id: "timelineWrapper",
      style: {
        backgroundColor: timelineConfig.backgroundColor,
        width,
        height
      },
      children: [
        /* @__PURE__ */ jsxs4("div", { id: "actions", children: [
          /* @__PURE__ */ jsx6("button", { onClick: () => setZoom(timelineConfig.gridZoom + 1), children: "Zoom in" }),
          /* @__PURE__ */ jsx6("button", { onClick: () => setZoom(1), children: "Zoom reset" }),
          /* @__PURE__ */ jsx6(
            "button",
            {
              disabled: timelineConfig.gridZoom <= 1,
              onClick: () => setZoom(timelineConfig.gridZoom - 1),
              children: "Zoom out"
            }
          )
        ] }),
        /* @__PURE__ */ jsx6(
          TimelineCanvas,
          {
            events,
            timelineConfig,
            onEventClick,
            setZoom,
            width: currentWidth,
            height: currentHeight
          }
        )
      ]
    }
  );
};
var TimelineCanvas = ({
  events,
  timelineConfig,
  setZoom,
  height,
  width,
  onEventClick
}) => {
  const clientTimeline = getClientTimeline(
    timelineConfig,
    events,
    width,
    height
  );
  const [focusedEvent, setFocusedEvent] = useState();
  const getRowBottomY = (rowIndex) => {
    return clientTimeline.rowHeight * rowIndex + clientTimeline.rowHeight;
  };
  return /* @__PURE__ */ jsxs4(
    "div",
    {
      style: {
        backgroundColor: clientTimeline.backgroundColor,
        position: "relative",
        height: clientTimeline.height,
        width: clientTimeline.width
      },
      children: [
        /* @__PURE__ */ jsx6(
          "div",
          {
            id: "coverShape",
            style: {
              background: timelineConfig.backgroundColor,
              height: timelineConfig.ticksHeight,
              left: 0,
              position: "absolute",
              top: 0,
              width: timelineConfig.rowDrawerWidth,
              zIndex: 1
            }
          }
        ),
        /* @__PURE__ */ jsxs4(
          "div",
          {
            id: "scrollable",
            style: {
              overflow: "auto",
              position: "relative",
              height: clientTimeline.height,
              width: clientTimeline.width
            },
            children: [
              /* @__PURE__ */ jsx6(TimelineTickBar, { clientTimeline }),
              /* @__PURE__ */ jsxs4(
                "div",
                {
                  id: "grid-wrapper",
                  style: {
                    display: "flex",
                    width: clientTimeline.gridWidth
                  },
                  children: [
                    /* @__PURE__ */ jsx6(TimelineRowDrawer, { clientTimeline }),
                    /* @__PURE__ */ jsxs4(
                      "svg",
                      {
                        width: clientTimeline.gridWidth,
                        height: clientTimeline.gridHeight,
                        style: {
                          flex: `0 0 ${clientTimeline.gridWidth}px`
                        },
                        children: [
                          /* @__PURE__ */ jsx6("defs", { children: /* @__PURE__ */ jsxs4("filter", { x: "0", y: "0", width: "1", height: "1", id: "labelBackground", children: [
                            /* @__PURE__ */ jsx6(
                              "feFlood",
                              {
                                "flood-color": clientTimeline.backgroundColor,
                                result: "bg"
                              }
                            ),
                            /* @__PURE__ */ jsxs4("feMerge", { children: [
                              /* @__PURE__ */ jsx6("feMergeNode", { in: "bg" }),
                              /* @__PURE__ */ jsx6("feMergeNode", { in: "SourceGraphic" })
                            ] })
                          ] }) }),
                          /* @__PURE__ */ jsx6(TimelineGridTicks, { clientTimeline }),
                          clientTimeline.clientGroups.map((group, groupIndex) => {
                            return /* @__PURE__ */ jsx6(
                              "line",
                              {
                                className: "timelineGridRowBottomLine",
                                x1: 0,
                                x2: clientTimeline.gridWidth,
                                y1: getRowBottomY(groupIndex),
                                y2: getRowBottomY(groupIndex),
                                stroke: clientTimeline.primaryColor,
                                strokeWidth: 1
                              }
                            );
                          }),
                          /* @__PURE__ */ jsx6(
                            "line",
                            {
                              className: "timelineGridEdgeRight",
                              x1: clientTimeline.gridWidth,
                              x2: clientTimeline.gridWidth,
                              y1: 0,
                              y2: clientTimeline.gridHeight,
                              stroke: clientTimeline.primaryColor,
                              strokeWidth: 1
                            }
                          ),
                          clientTimeline.clientEvents.map((event) => {
                            return /* @__PURE__ */ jsx6(
                              TimelineEvent,
                              {
                                onEventClick,
                                event,
                                clientTimeline,
                                setFocusedEvent,
                                focusedEvent
                              }
                            );
                          }),
                          focusedEvent && /* @__PURE__ */ jsx6(
                            TimelineEvent,
                            {
                              onEventClick,
                              event: focusedEvent,
                              clientTimeline,
                              setFocusedEvent
                            }
                          )
                        ]
                      }
                    )
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
};
export {
  Timeline,
  TimelineCanvas,
  defaultTimelineConfig
};
