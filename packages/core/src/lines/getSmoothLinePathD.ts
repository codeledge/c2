import { Point } from "../types/Point";

export type SmoothLinePathOptions = {
  orientation?: "horizontal" | "vertical";
};

export const getSmoothLinePathD = (
  { x: startX, y: startY }: Point,
  { x: endX, y: endY }: Point,
  options?: SmoothLinePathOptions
) => {
  if (options?.orientation === "vertical") {
    const yDiff = endY - startY;

    const halfY = yDiff / 2 + startY;

    return `M${startX},${startY} C${startX},${halfY} ${endX},${halfY} ${endX},${endY}`;
  } else {
    const xDiff = endX - startX;

    const halfX = xDiff / 2 + startX;

    return `M${startX},${startY} C${halfX},${startY} ${halfX},${endY} ${endX},${endY}`;
  }
};
