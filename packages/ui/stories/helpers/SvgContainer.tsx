import { PropsWithChildren } from "react";

export const SvgContainer = ({ children }: PropsWithChildren) => {
  return (
    <svg height={500} width={1200} style={{ background: "lightgrey" }}>
      {children}
    </svg>
  );
};
