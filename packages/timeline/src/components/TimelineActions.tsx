import { TimelineConfig } from "../types/TimelineConfig";

export const TimelineActions = ({
  timelineConfig,
  updateTimelineConfig,
}: {
  timelineConfig: TimelineConfig;
  updateTimelineConfig: (p: Partial<TimelineConfig>) => void;
}) => {
  return (
    <div
      id="actions"
      style={{
        display: "flex",
        gap: 4,
        padding: 4,
        boxSizing: "border-box",
        alignItems: "center",
      }}
    >
      <button
        onClick={() =>
          updateTimelineConfig({ gridZoom: timelineConfig.gridZoom + 1 })
        }
      >
        +
      </button>
      <button onClick={() => updateTimelineConfig({ gridZoom: 1 })}>
        Zoom reset
      </button>
      <button
        disabled={timelineConfig.gridZoom <= 1}
        onClick={() =>
          updateTimelineConfig({ gridZoom: timelineConfig.gridZoom - 1 })
        }
      >
        -
      </button>
      <button
      // onClick={() =>
      //   setFocusedEvent(
      //     focusedEvent
      //       ? timelineConfig.clientEvents[focusedEvent.eventIndex - 1]
      //       : last(timelineConfig.clientEvents)
      //   )
      // }
      >
        {"<"}
      </button>
      <button
      // onClick={() =>
      //   setFocusedEvent(
      //     focusedEvent
      //       ? timelineConfig.clientEvents[focusedEvent.eventIndex + 1]
      //       : first(timelineConfig.clientEvents)
      //   )
      // }
      >
        {">"}
      </button>
      <button
        onClick={() =>
          updateTimelineConfig({ showRowLabels: !timelineConfig.showRowLabels })
        }
      >
        toggle row labels
      </button>
      <button
        onClick={() =>
          updateTimelineConfig({
            showEventLabels: !timelineConfig.showEventLabels,
          })
        }
      >
        toggle event labels
      </button>
      <button
        onClick={() =>
          updateTimelineConfig({
            showEventDates: !timelineConfig.showEventDates,
          })
        }
      >
        toggle event dates
      </button>
    </div>
  );
};
