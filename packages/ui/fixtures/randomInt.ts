export const randomInt: (start?: number, end?: number) => number = (
  start = 22,
  end = 100
) => Math.floor(Math.random() * (end - start + 1) + start);
