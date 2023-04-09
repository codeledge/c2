import { ClientTimeline } from "../Timeline";

export const TimelineGridTicks = ({
  clientTimeline,
}: {
  clientTimeline: ClientTimeline;
}) => {
  return (
    <>
      <line
        className="borderLeft"
        x1={0}
        x2={0}
        y1={0}
        y2={clientTimeline.gridHeight}
        stroke={clientTimeline.secondaryColor}
        strokeWidth={1}
      />
      {clientTimeline.clientTicks.map((tick) => {
        return (
          <g key={tick.x}>
            <line
              className="tickGridVerticalDottedLine"
              x1={tick.x}
              x2={tick.x}
              y1={0}
              y2={clientTimeline.gridHeight}
              stroke={clientTimeline.secondaryColor}
              strokeWidth={1}
              strokeDasharray={"5,5"}
            />
          </g>
        );
      })}
      <line
        className="borderRight"
        x1={clientTimeline.gridWidth}
        x2={clientTimeline.gridWidth}
        y1={0}
        y2={clientTimeline.gridHeight}
        stroke={clientTimeline.secondaryColor}
        strokeWidth={1}
      />
    </>
  );
};
