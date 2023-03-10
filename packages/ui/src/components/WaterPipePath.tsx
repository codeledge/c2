import { useMemo } from "react";
import { getWaterPipePathD, Point, WaterPipePathOptions } from "@c2/core";

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
