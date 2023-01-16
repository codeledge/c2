import { TimelineConfig } from "../src/layouts/Timeline";

const rowHeight = 50;
export const defaultTimelineConfig: TimelineConfig = {
  rowHeight,
  gridWidth: 1000,
  gridLeft: 50,
  gridTop: 50,
  tickDensity: 10,
  gridHeight: rowHeight * 5,
  primaryColor: "grey",
  secondaryColor: "grey",
  backgroundColor: "lightGrey",
};
