import { ClientTimeline } from "../Timeline";
import { TimelineTick } from "./TimelineTick";

export const TimelineTickBar = ({
  clientTimeline,
}: {
  clientTimeline: ClientTimeline;
}) => {
  return (
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
      <svg width={clientTimeline.gridWidth} height={clientTimeline.ticksHeight}>
        <g id="ticks" transform={`translate(0 ${clientTimeline.ticksHeight})`}>
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
