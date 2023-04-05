import { ClientTimeline } from "../Timeline";

export const TimelineRowDrawer = ({
  clientTimeline,
}: {
  clientTimeline: ClientTimeline;
}) => {
  return (
    <div
      style={{
        position: "sticky",
        left: 0,
        flex: `0 0 ${clientTimeline.rowDrawerWidth - 1}px`,
        background: clientTimeline.backgroundColor,
        boxSizing: "border-box",
      }}
    >
      {clientTimeline.clientGroups.map((group) => {
        return (
          <div
            key={group.name}
            style={{
              height: clientTimeline.rowHeight,
              width: "100%",
            }}
          >
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: 10,
                fontFamily: "helvetica",
              }}
            >
              <p style={{ textAlign: "right" }}>{group.name}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
