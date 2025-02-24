import { describe, it, expect, vi } from "vitest";
import { checkUserInsideBuilding } from "../../utils/CheckIfUserInBuilding";

describe("Location and Highlighting Functions", () => {
  it("should return true if user is inside a building", () => {
    const mockGeoJson = {
      features: [
        {
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-73.5781, 45.4948],
                [-73.5777, 45.4948],
                [-73.5777, 45.4952],
                [-73.5781, 45.4952],
                [-73.5781, 45.4948],
              ],
            ],
          },
        },
      ],
    };

    const userLocation = { lat: 45.495, lng: -73.578 };
    const isInside = checkUserInsideBuilding(userLocation, mockGeoJson);
    expect(isInside).toBe(true);
  });

  it("should return false if user is outside any building", () => {
    const mockGeoJson = {
      features: [
        {
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-73.5781, 45.4948],
                [-73.5777, 45.4948],
                [-73.5777, 45.4952],
                [-73.5781, 45.4952],
                [-73.5781, 45.4948],
              ],
            ],
          },
        },
      ],
    };

    const userLocation = { lat: 45.5000, lng: -73.5800 };
    const isInside = checkUserInsideBuilding(userLocation, mockGeoJson);
    expect(isInside).toBe(false);
  });
});
