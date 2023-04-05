import { ClientTimeline } from "../Timeline";
import { TimelineTick } from "./TimelineTick";

export const TimelineTickBar = ({
  clientTimeline,
}: {
  clientTimeline: ClientTimeline;
}) => {
  const width = clientTimeline.gridWidth + clientTimeline.gridMarginRight * 2;
  return (
    <div
      id="tick-wrapper"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        left: 0,
        background: clientTimeline.backgroundColor,
        height: clientTimeline.ticksHeight,
        width: "100%",
      }}
    >
      <svg width={"100%"} height={clientTimeline.ticksHeight}>
        <g
          id="ticks"
          transform={`translate(${clientTimeline.rowDrawerWidth} ${clientTimeline.ticksHeight})`}
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
  );
};
