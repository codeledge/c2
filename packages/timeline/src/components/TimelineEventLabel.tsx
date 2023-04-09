import { useRef, useState, useEffect } from "react";
import { Label, Tag, Text } from "react-konva";
import { ClientTimeline } from "../Timeline";
import { ClientTimelineEvent } from "./TimelineEvent";

export const TimelineEventLabel = ({
  event,
  clientTimeline,
}: {
  event: ClientTimelineEvent;
  clientTimeline: ClientTimeline;
}) => {
  const textRef = useRef(null);

  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    // @ts-ignore
    if (textRef?.current) setTextWidth(textRef?.current?.getTextWidth());
  }, []);

  return (
    <Label
      y={
        event.y -
        clientTimeline.eventCircleRadius -
        clientTimeline.eventNameFontSize -
        2
      }
      x={event.x - 2}
      visible={!!textWidth}
    >
      <Tag
        fill={clientTimeline.backgroundColor}
        stroke={clientTimeline.primaryColor}
        strokeWidth={1}
        cornerRadius={2}
        offsetX={textWidth / 2}
      />
      <Text
        fontFamily="helvetica"
        align="center"
        fill={clientTimeline.primaryColor}
        ellipsis={true}
        offsetX={textWidth / 2}
        padding={2}
        wrap="none"
        verticalAlign="bottom"
        fontSize={clientTimeline.eventNameFontSize}
        text={event.name}
        ref={textRef}
      />
    </Label>
  );
};
