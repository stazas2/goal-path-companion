import { cn } from "./utils";

describe("cn utility", () => {
  it("combines class names correctly", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles empty values", () => {
    expect(cn("foo", "")).toBe("foo");
  });
});