import { describe, it, expect } from "vitest";
import { add } from "../utils/math.js";

describe("add function", () => {
  it("should return the sum of two numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  it("should return 0 when adding 0 and 0", () => {
    expect(add(0, 0)).toBe(0);
  });

  it("should handle negative numbers", () => {
    expect(add(-2, -3)).toBe(-5);
  });
});
