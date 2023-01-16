import { DateTime } from "luxon";
import { TimelineConfig } from "../layouts/Timeline";
import { getElongatedCirclePathD } from "shapes";

export type TimelineEventData = {
  name: string;
  date?: string | Date;
  startDate?: string | Date;
  endDate?: string | Date;
};

export type ClientTimelineEvent = TimelineEventData & {
  x?: number;
  y: number;
  startX?: number;
  endX?: number;
  dateTime?: DateTime;
  startDateTime?: DateTime;
  endDateTime?: DateTime;
};

export type TimelineEventProps = {
  event: ClientTimelineEvent;
  onEventClick?: (event: TimelineEventData) => void;
  timelineConfig: TimelineConfig;
} & React.SVGProps<SVGCircleElement>;

const eventCircleRadius = 5;
const eventDateFontSize = 12;
const eventNameFontSize = 13;

export const TimelineEvent = ({
  event,
  onEventClick,
  timelineConfig,
  ...props
}: TimelineEventProps) => {
  return (
    <g
      transform={`translate(${event.x},${event.y})`}
      onClick={onEventClick ? () => onEventClick(event) : undefined}
      cursor={onEventClick ? "pointer" : undefined}
    >
      <text
        dy={-eventNameFontSize + 1}
        textAnchor="middle"
        fontFamily="helvetica"
        color={timelineConfig.primaryColor}
        fontSize={eventNameFontSize}
      >
        {event.name}
      </text>
      {event.dateTime && (
        <circle
          cx={0}
          cy={0}
          r={eventCircleRadius}
          fill="lightgrey"
          stroke="grey"
          strokeWidth="3"
          {...props}
        />
      )}
      {(event.startX || event.endX) && (
        <path
          d={getElongatedCirclePathD(
            event.startX ? { x: event.startX! - event.x!, y: 0 } : undefined,
            event.endX ? { x: event.endX! - event.x!, y: 0 } : undefined,
            eventCircleRadius
          )}
          fill="none"
          stroke={timelineConfig.primaryColor}
          strokeWidth="3"
          {...props}
        />
      )}
      <text
        dy={eventCircleRadius + eventDateFontSize + 2}
        textAnchor="middle"
        fontFamily="helvetica"
        color={timelineConfig.primaryColor}
        fontSize={12}
      >
        {event.dateTime
          ? event.dateTime?.toFormat("yyyy-MM-dd HH:mm:ss")
          : event.startDateTime && event.endDateTime
          ? `${event.startDateTime?.toFormat(
              "yyyy-MM-dd HH:mm:ss"
            )} - ${event.endDateTime?.toFormat("yyyy-MM-dd HH:mm:ss")}`
          : event.startDateTime
          ? event.startDateTime?.toFormat("yyyy-MM-dd HH:mm:ss")
          : event.endDateTime?.toFormat("yyyy-MM-dd HH:mm:ss")}
      </text>
    </g>
  );
};
