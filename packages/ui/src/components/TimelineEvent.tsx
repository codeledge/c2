export type TimelineEventData = {
  name: string;
  date: string;
};

export type TimelineEventProps = {
  x: number;
  y: number;
  event: TimelineEventData;
  onEventClick?: (event: TimelineEventData) => void;
} & React.SVGProps<SVGCircleElement>;

export const TimelineEvent = ({
  x,
  y,
  event,
  onEventClick,
  ...props
}: TimelineEventProps) => {
  return (
    <circle
      cx={x}
      cy={y}
      r="5"
      fill="lightgrey"
      stroke="grey"
      strokeWidth="3"
      onClick={onEventClick ? () => onEventClick(event) : undefined}
      cursor={onEventClick ? "pointer" : undefined}
      {...props}
    />
  );
};
