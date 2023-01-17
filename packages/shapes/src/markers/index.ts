import { Point } from "../types/Point";

export const getElongatedCirclePathD = (
  start: Point,
  end: Point,
  radius: number = 5
) => {
  return `M${start.x},${start.y - radius} A${radius},${radius} 0 0 0 ${
    start.x
  } ${start.y + radius} H${end.x} A${radius},${radius} 0 0 0 ${end.x} ${
    end.y - radius
  } H${start.x}`;

  // if (start && !end) {
  //   return `M${start.x + radius},${
  //     start.y - radius
  //   } h${-radius} A${radius},${radius} 0 0 0 ${start.x} ${
  //     start.y + radius
  //   } h${radius}`;
  // }

  // if (!start && end) {
  //   return `M${end.x - radius},${
  //     end.y - radius
  //   } h${radius} A${radius},${radius} 0 0 1 ${end.x} ${
  //     end.y + radius
  //   } h${-radius}`;
  // }
};
