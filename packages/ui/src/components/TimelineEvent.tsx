import { DateTime } from "luxon";
import { ClientTimeline } from "../layouts/Timeline";
import { getElongatedCirclePathD } from "shapes";

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
  dateTime: DateTime;
  startDateTime?: DateTime;
  endDateTime?: DateTime;
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

const eventCircleRadius = 5;
const eventDateFontSize = 12;
const eventNameFontSize = 13;

export const TimelineEvent = ({
  event,
  onEventClick,
  clientTimeline,
  setFocusedEvent,
  focusedEvent,
  ...props
}: TimelineEventProps) => {
  return (
    <g
      transform={`translate(${event.x},${event.y})`}
      style={{
        opacity: focusedEvent?.id ? 0.2 : 1,
      }}
      onClick={onEventClick ? () => onEventClick(event) : undefined}
      cursor={onEventClick ? "pointer" : undefined}
      onMouseEnter={() => {
        setFocusedEvent?.(event);
      }}
      onMouseLeave={() => {
        setFocusedEvent?.(undefined);
      }}
      tabIndex={1}
    >
      {event.name && (
        <text
          filter="url(#labelBackground)"
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
          fill={clientTimeline.backgroundColor}
          stroke={clientTimeline.primaryColor}
          strokeWidth={clientTimeline.eventStrokeWidth}
          {...props}
        />
      ) : (
        <circle
          cx={0}
          cy={0}
          r={eventCircleRadius}
          fill={clientTimeline.backgroundColor}
          stroke={clientTimeline.primaryColor}
          strokeWidth={clientTimeline.eventStrokeWidth}
          {...props}
        />
      )}
      <text
        filter="url(#labelBackground)"
        dy={eventCircleRadius + eventDateFontSize + 2}
        textAnchor="middle"
        fontFamily="helvetica"
        color={clientTimeline.primaryColor}
        fontSize={12}
      >
        {event.startDateTime && event.endDateTime
          ? `${event.startDateTime?.toFormat(
              clientTimeline.eventDateFormat
            )} - ${event.endDateTime?.toFormat(clientTimeline.eventDateFormat)}`
          : event.dateTime?.toFormat(clientTimeline.eventDateFormat)}
      </text>
    </g>
  );
};
