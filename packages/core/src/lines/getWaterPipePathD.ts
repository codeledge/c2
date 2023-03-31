import { WaterPipePathOptions } from "./WaterPipePath";
import { getSmoothLinePathD } from "./getSmoothLinePathD";
import { Point } from "deverything";

export const getWaterPipePathD = (
  source: Point,
  target: Point,
  options?: WaterPipePathOptions
) => {
  if (source.x === target.x) return `M${source.x},${source.y} V${target.y}`;
  if (source.y === target.y) return `M${source.x},${source.y} H${target.x}`;

  if (options?.orientation === "vertical") {
    const yDiff = target.y - source.y;

    const r = Math.min(
      options?.arcRadius || Infinity,
      Math.abs(yDiff) / 4 // cap radius to this limit
    );

    const halfY = yDiff / 2 + source.y;
    const arcStartY = halfY - r * Math.sign(yDiff);
    const arcEndY = halfY + r * Math.sign(yDiff);

    //if there is not enough space for arc use cubic line
    if (Math.abs(source.x - target.x) < 2 * r) {
      return getSmoothLinePathD(source, target, options);
    }

    const isLeft = source.x > target.x;
    const isDown = source.y > target.y;

    const ax1 = isLeft ? source.x - r : source.x + r;
    const ay1 = isDown ? arcStartY - r : arcStartY + r;
    const hEnd = isLeft ? target.x + r : target.x - r;

    const d = `M${source.x},${source.y} V${arcStartY} A${r} ${r} 0 0 ${
      isLeft ? (isDown ? 0 : 1) : isDown ? 1 : 0
    } ${ax1} ${ay1} H${hEnd} A${r} ${r} 0 0 ${
      isLeft ? (isDown ? 1 : 0) : isDown ? 0 : 1
    } ${target.x} ${arcEndY} V${target.y}`;

    return d;
  } else {
    const xDiff = target.x - source.x;

    const r = Math.min(
      options?.arcRadius || Infinity,
      Math.abs(xDiff) / 4 // cap radius to this limit
    );

    const halfX = xDiff / 2 + source.x;
    const arcStartX = halfX - r * Math.sign(xDiff);
    const arcEndX = halfX + r * Math.sign(xDiff);

    //if there is not enough space for arc use smooth line
    if (Math.abs(source.y - target.y) < 2 * r) {
      return getSmoothLinePathD(source, target, options);
    }

    const isLeft = source.x > target.x;
    const isDown = source.y > target.y;

    const ay1 = isDown ? source.y - r : source.y + r;
    const ax1 = isLeft ? arcStartX - r : arcStartX + r;
    const vEnd = isDown ? target.y + r : target.y - r;

    const d = `M${source.x},${source.y} H${arcStartX} A${r} ${r} 0 0 ${
      isLeft ? (isDown ? 1 : 0) : isDown ? 0 : 1
    } ${ax1} ${ay1} V${vEnd} A${r} ${r} 0 0 ${
      isLeft ? (isDown ? 0 : 1) : isDown ? 1 : 0
    } ${arcEndX} ${target.y} H${target.x}`;

    return d;
  }
};
