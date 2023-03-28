import { DateTime } from 'luxon';
import { ReactNode } from 'react';

type TimelineEventData = {
    id?: string | number;
    name?: string;
    date?: string | Date;
    startDate?: string | Date;
    endDate?: string | Date;
    [x: string]: any;
};
type ClientTimelineEvent = TimelineEventData & {
    x: number;
    y: number;
    startX?: number;
    endX?: number;
    dateTime: DateTime;
    startDateTime?: DateTime;
    endDateTime?: DateTime;
};
type TimelineEventProps = {
    event: ClientTimelineEvent;
    focusedEvent?: ClientTimelineEvent;
    onEventClick?: (event: TimelineEventData) => void;
    setFocusedEvent?: React.Dispatch<React.SetStateAction<ClientTimelineEvent | undefined>>;
    clientTimeline: ClientTimeline;
} & React.SVGProps<SVGCircleElement>;

type ClientTimelineGroup = {
    name: string;
    index: number;
};

type ClientTimelineTick = {
    x: number;
    label: string;
};

type TimelineProps = {
    events: TimelineEventData[];
    title?: ReactNode;
    height?: number | string;
    width?: number | string;
    onEventClick?: TimelineEventProps["onEventClick"];
    options?: Partial<TimelineConfig>;
};
type TimelineConfig = {
    backgroundColor: string;
    eventDateFormat: string;
    eventStrokeWidth: number;
    gridMarginRight: number;
    gridZoom: number;
    groupBy?: string;
    primaryColor: string;
    rowDrawerWidth: number;
    rowHeight: number;
    secondaryColor: string;
    tickDensity: number;
    ticksHeight: number;
};
type ClientTimeline = TimelineConfig & {
    gridHeight: number;
    gridWidth: number;
    height: number;
    width: number;
    clientEvents: ClientTimelineEvent[];
    clientGroups: ClientTimelineGroup[];
    eventsDurationMilliseconds: number;
    gridDurationMilliseconds: number;
    gridEndDateTime: DateTime;
    maxDateTime?: DateTime;
    gridStartDateTime: DateTime;
    minDateTime?: DateTime;
    clientTicks: ClientTimelineTick[];
};
declare const defaultTimelineConfig: TimelineConfig;
declare const Timeline: ({ events, options, height, width, onEventClick, }: TimelineProps) => JSX.Element;
declare const TimelineCanvas: ({ events, timelineConfig, setZoom, height, width, onEventClick, }: Omit<TimelineProps, "height" | "width"> & {
    width: number;
    height: number;
    timelineConfig: TimelineConfig;
    setZoom: any;
}) => JSX.Element;

export { ClientTimeline, Timeline, TimelineCanvas, TimelineConfig, TimelineProps, defaultTimelineConfig };
