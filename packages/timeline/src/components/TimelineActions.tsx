import { ClientTimeline } from "../Timeline";
import { TimelineTick } from "./TimelineTick";

export const TimelineActions = ({
  clientTimeline,
  setZoom,
}: {
  clientTimeline: ClientTimeline;
  setZoom: any;
}) => {
  return (
    <div
      id="actions"
      style={{ display: "flex", gap: 4, height: clientTimeline.actionsHeight }}
    >
      <button onClick={() => setZoom(clientTimeline.gridZoom + 1)}>+</button>
      <button onClick={() => setZoom(1)}>Zoom reset</button>
      <button
        disabled={clientTimeline.gridZoom <= 1}
        onClick={() => setZoom(clientTimeline.gridZoom - 1)}
      >
        -
      </button>
      <button
      // onClick={() =>
      //   setFocusedEvent(
      //     focusedEvent
      //       ? clientTimeline.clientEvents[focusedEvent.eventIndex - 1]
      //       : last(clientTimeline.clientEvents)
      //   )
      // }
      >
        {"<"}
      </button>
      <button
      // onClick={() =>
      //   setFocusedEvent(
      //     focusedEvent
      //       ? clientTimeline.clientEvents[focusedEvent.eventIndex + 1]
      //       : first(clientTimeline.clientEvents)
      //   )
      // }
      >
        {">"}
      </button>
    </div>
  );
};
