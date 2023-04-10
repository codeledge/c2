import { Layer, Group, Rect, Line, Text } from "react-konva";
import { ClientTimeline } from "../types/ClientTimeline";
import { Point } from "deverything";

export type ClientTimelineRowLabel = {
  index: number;
  name?: string;
};

export const TimelineRowLabels = ({
  clientTimeline,
  scrollPosition,
}: {
  clientTimeline: ClientTimeline;
  scrollPosition: Point;
}) => {
  if (!clientTimeline.showRowLabels) return null;

  return (
    <Layer y={clientTimeline.ticksHeight} x={clientTimeline.gridMargin}>
      {clientTimeline.showRowLabels && (
        <Group id="stickyRowLabels" y={-scrollPosition.y}>
          <Rect
            height={clientTimeline.gridHeight}
            width={clientTimeline.rowDrawerWidth}
            fill={clientTimeline.backgroundColor}
          />
          <Line
            className="borderLeft"
            points={[0, 0, 0, clientTimeline.gridHeight]}
            stroke={clientTimeline.secondaryColor}
            strokeWidth={1}
          />
          <Line
            className="borderTop"
            points={[0, 0, clientTimeline.rowDrawerWidth, 0]}
            stroke={clientTimeline.secondaryColor}
            strokeWidth={1}
          />
          <Line
            className="borderBottom"
            points={[
              0,
              clientTimeline.gridHeight,
              clientTimeline.rowDrawerWidth,
              clientTimeline.gridHeight,
            ]}
            stroke={clientTimeline.secondaryColor}
            strokeWidth={1}
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
              >
                <Text
                  align="right"
                  text={group.name}
                  fontSize={14}
                  padding={5}
                  width={clientTimeline.rowDrawerWidth}
                  height={clientTimeline.rowHeight}
                  verticalAlign="middle"
                />
              </Group>
            );
          })}
        </Group>
      )}
    </Layer>
  );
};
