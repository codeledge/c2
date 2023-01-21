import { ClientTimeline } from "../layouts/Timeline";

export const TimelineGridTicks = ({
  clientTimeline,
}: {
  clientTimeline: ClientTimeline;
}) => {
  return (
    <>
      {clientTimeline.clientTicks.slice(1).map((tick) => {
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
            />
          </g>
        );
      })}
    </>
  );
};
