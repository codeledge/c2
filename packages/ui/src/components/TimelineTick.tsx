import { ClientTimeline } from "../layouts/Timeline";

export type ClientTimelineTick = {
  x: number;
  label: string;
};

export const TimelineTick = ({
  clientTick,
  clientTimeline,
}: {
  clientTick: ClientTimelineTick;
  clientTimeline: ClientTimeline;
}) => {
  return (
    <g key={clientTick.x}>
      <text
        x={clientTick.x}
        y={-10}
        fontSize={9}
        textAnchor="middle"
        fill={clientTimeline.primaryColor}
      >
        {clientTick.label}
      </text>
      <line
        x1={clientTick.x}
        y1={0}
        x2={clientTick.x}
        y2={-5}
        stroke={clientTimeline.primaryColor}
      />
    </g>
  );
};
