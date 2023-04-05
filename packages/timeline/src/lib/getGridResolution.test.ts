import { getGridResolution } from "./getGridResolution";

describe("getGridResolution", () => {
  test("no arg", async () => {
    console.log(getGridResolution(321000, 123, 17));
    expect(getGridResolution(321000, 123, 17)).toStrictEqual([]);
  });
});
