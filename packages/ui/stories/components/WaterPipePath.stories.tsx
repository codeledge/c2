import { Meta } from "@storybook/react";
import { WaterPipePath } from "../../src/components/WaterPipePath";
import Draggable from "react-draggable"; // The default
import React, { useRef } from "react";

export default {
  title: "Components/WaterPipePath",
} as Meta;

export const Primary = () => {
  const [source, setSource] = React.useState({ x: 10, y: 15 });
  const [target, setTarget] = React.useState({ x: 100, y: 100 });

  return (
    <svg style={{ background: "lightgrey" }}>
      <WaterPipePath source={source} target={target} />
      <Draggable
        defaultPosition={source}
        onDrag={(_, { x, y }) => setSource({ x, y })}
      >
        <circle cx={0} cy={0} r={5} fill="red" />
      </Draggable>
      <Draggable
        defaultPosition={target}
        onDrag={(_, { x, y }) => setTarget({ x, y })}
      >
        <circle cx={0} cy={0} r={5} fill="red" />
      </Draggable>
    </svg>
  );
};
