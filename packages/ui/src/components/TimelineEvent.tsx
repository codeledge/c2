import { DateTime } from "luxon";
import { ClientTimeline } from "../layouts/Timeline";
import { getElongatedCirclePathD } from "shapes";

export type TimelineEventData = {
  id?: string | number;
  name?: string;
  date?: string | Date;
  startDate?: string | Date;
  endDate?: string | Date;
};

export type ClientTimelineEvent = TimelineEventData & {
  x: number;
  y: number;
  startX?: number;
  endX?: number;
  dateTime: DateTime;
  startDateTime?: DateTime;
  endDateTime?: DateTime;
};

export type TimelineEventProps = {
  event: ClientTimelineEvent;
  onEventClick?: (event: TimelineEventData) => void;
  clientTimeline: ClientTimeline;
} & React.SVGProps<SVGCircleElement>;

const eventCircleRadius = 5;
const eventDateFontSize = 12;
const eventNameFontSize = 13;

export const TimelineEvent = ({
  event,
  onEventClick,
  clientTimeline,
  ...props
}: TimelineEventProps) => {
  return (
    <g
      transform={`translate(${event.x},${event.y})`}
      onClick={onEventClick ? () => onEventClick(event) : undefined}
      cursor={onEventClick ? "pointer" : undefined}
    >
      {event.name && (
        <text
          dy={-eventNameFontSize + 1}
          textAnchor="middle"
          fontFamily="helvetica"
          color={clientTimeline.primaryColor}
          fontSize={eventNameFontSize}
        >
          {event.name}
        </text>
      )}
      {event.startX && event.endX ? (
        <path
          d={getElongatedCirclePathD(
            { x: event.startX - event.x, y: 0 }, //because is relative to g
            { x: event.endX - event.x, y: 0 },
            eventCircleRadius
          )}
          fill="none"
          stroke={clientTimeline.primaryColor}
          strokeWidth="3"
          {...props}
        />
      ) : (
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
      <text
        dy={eventCircleRadius + eventDateFontSize + 2}
        textAnchor="middle"
        fontFamily="helvetica"
        color={clientTimeline.primaryColor}
        fontSize={12}
      >
        {event.startDateTime && event.endDateTime
          ? `${event.startDateTime?.toFormat(
              "yyyy-MM-dd HH:mm:ss"
            )} - ${event.endDateTime?.toFormat("yyyy-MM-dd HH:mm:ss")}`
          : event.dateTime?.toFormat("yyyy-MM-dd HH:mm:ss")}
      </text>
    </g>
  );
};
