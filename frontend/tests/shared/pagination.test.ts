import { getVisiblePages } from "@/shared/pagination";


describe("getVisiblePages", () => {
  it("returns a compact page set around the current page", () => {
    expect(getVisiblePages(5, 10)).toEqual([1, 4, 5, 6, 10]);
  });

  it("returns an empty list when there are no pages", () => {
    expect(getVisiblePages(1, 0)).toEqual([]);
  });
});
