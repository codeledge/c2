import { Meta } from "@storybook/react";
import { WaterPipePath } from "../../src/components/WaterPipePath";
import { useState } from "react";
import { DraggableDot } from "../helpers/DraggableDot";
import { SvgContainer } from "../helpers/SvgContainer";

export default {
  title: "Components/WaterPipePath",
} as Meta;

export const HorizontalFreeArc = () => {
  const [source, setSource] = useState({ x: 10, y: 15 });
  const [target, setTarget] = useState({ x: 100, y: 100 });

  return (
    <SvgContainer>
      <WaterPipePath source={source} target={target} />
      <DraggableDot point={source} setPoint={setSource} />
      <DraggableDot point={target} setPoint={setTarget} />
    </SvgContainer>
  );
};

export const HorizontalFixedArc = () => {
  const [source, setSource] = useState({ x: 10, y: 15 });
  const [target, setTarget] = useState({ x: 100, y: 100 });

  return (
    <SvgContainer>
      <WaterPipePath
        source={source}
        target={target}
        options={{
          arcRadius: 5,
        }}
      />
      <DraggableDot point={source} setPoint={setSource} />
      <DraggableDot point={target} setPoint={setTarget} />
    </SvgContainer>
  );
};

export const VericalFreeArc = () => {
  const [source, setSource] = useState({ x: 10, y: 15 });
  const [target, setTarget] = useState({ x: 100, y: 100 });

  return (
    <SvgContainer>
      <WaterPipePath
        source={source}
        target={target}
        options={{
          orientation: "vertical",
        }}
      />
      <DraggableDot point={source} setPoint={setSource} />
      <DraggableDot point={target} setPoint={setTarget} />
    </SvgContainer>
  );
};

export const VericalFixedArc = () => {
  const [source, setSource] = useState({ x: 10, y: 15 });
  const [target, setTarget] = useState({ x: 100, y: 100 });

  return (
    <SvgContainer>
      <WaterPipePath
        source={source}
        target={target}
        options={{
          orientation: "vertical",
          arcRadius: 5,
        }}
      />
      <DraggableDot point={source} setPoint={setSource} />
      <DraggableDot point={target} setPoint={setTarget} />
    </SvgContainer>
  );
};
