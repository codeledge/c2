import { useMemo } from "react";
import { getWaterPipePathD } from "./getWaterPipePathD";
import { Point } from "deverything";

export type WaterPipePathOptions = {
  orientation?: "horizontal" | "vertical";
  arcRadius?: number;
};

export const WaterPipePath = ({
  options,
  source,
  target,
  ...props
}: {
  options?: WaterPipePathOptions;
  source: Point;
  target: Point;
}) => {
  const d = useMemo(
    () => getWaterPipePathD(source, target, options),
    [options, source, target]
  );
  return <path d={d} fill="none" stroke="grey" strokeWidth="5" {...props} />;
};
