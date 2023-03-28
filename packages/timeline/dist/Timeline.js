"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/Timeline.tsx
var Timeline_exports = {};
__export(Timeline_exports, {
  Timeline: () => Timeline,
  TimelineCanvas: () => TimelineCanvas,
  defaultTimelineConfig: () => defaultTimelineConfig
});
module.exports = __toCommonJS(Timeline_exports);
var import_react = require("react");
var import_usehooks_ts = require("usehooks-ts");

// src/components/TimelineEvent.tsx
var import_core = require("@c2/core");
var import_jsx_runtime = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
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
        event.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
        event.startX && event.endX ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "path",
          __spreadValues({
            d: (0, import_core.getElongatedCirclePathD)(
              { x: event.startX - event.x, y: 0 },
              { x: event.endX - event.x, y: 0 },
              eventCircleRadius
            ),
            fill: clientTimeline.backgroundColor,
            stroke: clientTimeline.primaryColor,
            strokeWidth: clientTimeline.eventStrokeWidth
          }, props)
        ) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
var import_jsx_runtime2 = require("react/jsx-runtime");
var TimelineGridTicks = ({
  clientTimeline
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_jsx_runtime2.Fragment, { children: clientTimeline.clientTicks.slice(1).map((tick) => {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("g", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
var import_jsx_runtime3 = require("react/jsx-runtime");
var TimelineRowDrawer = ({
  clientTimeline
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
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
        return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "div",
          {
            style: {
              height: clientTimeline.rowHeight,
              width: "100%"
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "div",
              {
                style: {
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: 10
                },
                children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { textAlign: "right" }, children: group.name })
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
var import_jsx_runtime4 = require("react/jsx-runtime");
var TimelineTick = ({
  clientTick,
  clientTimeline
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("g", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
var import_jsx_runtime5 = require("react/jsx-runtime");
var TimelineTickBar = ({
  clientTimeline
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
      children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("svg", { width: clientTimeline.gridWidth, height: clientTimeline.ticksHeight, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("g", { id: "ticks", transform: `translate(0 ${clientTimeline.ticksHeight})`, children: [
        clientTimeline.clientTicks.map((clientTick) => {
          return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            TimelineTick,
            {
              clientTick,
              clientTimeline
            },
            clientTick.x
          );
        }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
var import_core2 = require("@c2/core");
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
    let dateTime = (0, import_core2.parseDateTime)(event.date);
    const startDateTime = (0, import_core2.parseDateTime)(event.startDate);
    const endDateTime = (0, import_core2.parseDateTime)(event.endDate);
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
  const eventsDurationMilliseconds = maxDateTime.diff(minDateTime).as("milliseconds") || 1e7;
  const gridDurationPaddingMilliseconds = Math.floor(
    eventsDurationMilliseconds * 0.1
  );
  const gridResolution = getGridResolution(eventsDurationMilliseconds);
  const gridStartDateTime = minDateTime.minus({ milliseconds: gridDurationPaddingMilliseconds }).startOf(gridResolutionToDuration(gridResolution));
  const gridEndDateTime = maxDateTime.plus({ milliseconds: gridDurationPaddingMilliseconds }).endOf(gridResolutionToDuration(gridResolution));
  const gridDurationMilliseconds = gridEndDateTime.diff(gridStartDateTime).as("milliseconds");
  console.log({
    minDateTime,
    maxDateTime,
    groupMap,
    eventsDurationMilliseconds,
    gridDurationPaddingMilliseconds,
    gridStartDateTime,
    gridEndDateTime,
    gridDurationMilliseconds
  });
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
  return eventsDurationMilliseconds > import_core2.MILLISECONDS_IN_DECADE ? "YEAR" /* YEAR */ : eventsDurationMilliseconds > import_core2.MILLISECONDS_IN_YEAR ? "MONTH" /* MONTH */ : eventsDurationMilliseconds > import_core2.MILLISECONDS_IN_MONTH ? "DAY" /* DAY */ : "HOUR" /* HOUR */;
};
var getGridPositonX = (dateTime, gridStartDateTime, gridDurationMilliseconds, gridWidth) => {
  return dateTime.diff(gridStartDateTime).as("milliseconds") / gridDurationMilliseconds * gridWidth;
};

// src/Timeline.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
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
  const [wrapperRef, { width: currentWidth, height: currentHeight }] = (0, import_usehooks_ts.useElementSize)();
  const [timelineConfig, setTimelineConfig] = (0, import_react.useState)(__spreadValues(__spreadValues({}, defaultTimelineConfig), options));
  const setZoom = (zoom) => {
    setTimelineConfig((timelineConfig2) => __spreadProps(__spreadValues({}, timelineConfig2), {
      gridZoom: Math.max(zoom, 1)
    }));
  };
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
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
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { id: "actions", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { onClick: () => setZoom(timelineConfig.gridZoom + 1), children: "Zoom in" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { onClick: () => setZoom(1), children: "Zoom reset" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            "button",
            {
              disabled: timelineConfig.gridZoom <= 1,
              onClick: () => setZoom(timelineConfig.gridZoom - 1),
              children: "Zoom out"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
  const [focusedEvent, setFocusedEvent] = (0, import_react.useState)();
  const getRowBottomY = (rowIndex) => {
    return clientTimeline.rowHeight * rowIndex + clientTimeline.rowHeight;
  };
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
    "div",
    {
      style: {
        backgroundColor: clientTimeline.backgroundColor,
        position: "relative",
        height: clientTimeline.height,
        width: clientTimeline.width
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
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
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(TimelineTickBar, { clientTimeline }),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
                "div",
                {
                  id: "grid-wrapper",
                  style: {
                    display: "flex",
                    width: clientTimeline.gridWidth
                  },
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(TimelineRowDrawer, { clientTimeline }),
                    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
                      "svg",
                      {
                        width: clientTimeline.gridWidth,
                        height: clientTimeline.gridHeight,
                        style: {
                          flex: `0 0 ${clientTimeline.gridWidth}px`
                        },
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("filter", { x: "0", y: "0", width: "1", height: "1", id: "labelBackground", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                              "feFlood",
                              {
                                "flood-color": clientTimeline.backgroundColor,
                                result: "bg"
                              }
                            ),
                            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("feMerge", { children: [
                              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("feMergeNode", { in: "bg" }),
                              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("feMergeNode", { in: "SourceGraphic" })
                            ] })
                          ] }) }),
                          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(TimelineGridTicks, { clientTimeline }),
                          clientTimeline.clientGroups.map((group, groupIndex) => {
                            return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
                          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
                            return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
                          focusedEvent && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Timeline,
  TimelineCanvas,
  defaultTimelineConfig
});
