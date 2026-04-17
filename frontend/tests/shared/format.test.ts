import { formatMimeType, formatSize, truncateText } from "@/shared/format";


describe("format helpers", () => {
  it("formats file size in kilobytes", () => {
    expect(formatSize(2048)).toBe("2.0 KB");
  });

  it("formats long mime types into short labels", () => {
    expect(formatMimeType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")).toBe(
      "Excel (.xlsx)",
    );
  });

  it("keeps unknown mime types as is", () => {
    expect(formatMimeType("application/x-custom-type")).toBe("application/x-custom-type");
  });

  it("truncates long text to 100 characters with ellipsis", () => {
    const value = "a".repeat(120);

    expect(truncateText(value)).toBe(`${"a".repeat(97)}...`);
  });
});
