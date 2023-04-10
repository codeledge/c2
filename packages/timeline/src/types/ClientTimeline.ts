import { DateTime } from "luxon";
import { ClientTimelineEvent } from "../components/TimelineEvent";
import { ClientTimelineTick } from "../components/TimelineTick";
import { TimelineConfig } from "./TimelineConfig";
import { ClientTimelineRowLabel } from "../components/TimelineRowLabels";

export type ClientTimeline = TimelineConfig & {
  clientEvents: ClientTimelineEvent[];
  clientGroups: ClientTimelineRowLabel[];
  clientTicks: ClientTimelineTick[];
  eventsRangeMs: number;
  gridEndDateTime: DateTime;
  gridHeight: number;
  gridRangeMs: number;
  gridStartDateTime: DateTime;
  gridWidth: number;
  gridX: number;
  maxDateTime?: DateTime;
  minDateTime?: DateTime;
  scrollableHeight: number;
  scrollableWidth: number;
};
