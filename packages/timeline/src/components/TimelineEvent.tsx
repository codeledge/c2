import { DateTime } from "luxon";
import { ClientTimeline } from "../types/ClientTimeline";

export type TimelineEventData = {
  id?: string | number;
  name?: string;
  date?: string | Date;
  startDate?: string | Date;
  endDate?: string | Date;
  [x: string]: any;
};

export type ClientTimelineEvent = TimelineEventData & {
  x: number;
  y: number;
  startX?: number;
  endX?: number;
  groupIndex: number;
  dateTime: DateTime;
  startDateTime?: DateTime;
  endDateTime?: DateTime;
  edgeStartDateTime: DateTime;
  edgeEndDateTime: DateTime;
  clusterLabel?: string;
  eventIndex: number;
};

export type TimelineEventProps = {
  event: ClientTimelineEvent;
  focusedEvent?: ClientTimelineEvent;
  onEventClick?: (event: TimelineEventData) => void;
  setFocusedEvent?: React.Dispatch<
    React.SetStateAction<ClientTimelineEvent | undefined>
  >;
  clientTimeline: ClientTimeline;
} & React.SVGProps<SVGCircleElement>;
