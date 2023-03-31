import { Point } from "deverything";
import Draggable from "react-draggable";

export const DraggableDot = ({
  point,
  setPoint,
}: {
  point: Point;
  setPoint: (p: Point) => void;
}) => {
  return (
    <Draggable
      defaultPosition={point}
      onDrag={(_, { x, y }) => setPoint({ x, y })}
    >
      <circle cx={0} cy={0} r={10} fill="red" />
    </Draggable>
  );
};
