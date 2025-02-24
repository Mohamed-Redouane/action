import { point, polygon, booleanPointInPolygon } from "@turf/turf";

interface UserLocation {
  lat: number;
  lng: number;
}

interface GeoJson {
  features: {
    geometry: {
      type: string;
      coordinates: number[][][];
    };
  }[];
}

export function checkUserInsideBuilding(userLocation: UserLocation, geoJson: GeoJson): boolean {
  const userPoint = point([userLocation.lng, userLocation.lat]); //GeoJSON format

  return geoJson.features.some((feature) => {
    if (feature.geometry.type === "Polygon") {
      const buildingPolygon = polygon(feature.geometry.coordinates);
      return booleanPointInPolygon(userPoint, buildingPolygon);
    }
    return false;
  });
}
