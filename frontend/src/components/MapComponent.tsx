import React, { useEffect, useContext } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { LocationContext } from "./LocationContext";

interface MapComponentProps {
  geoJsonData: any;
  setIsUserInsideBuilding: (inside: boolean) => void;
}

function MapComponent({ geoJsonData, setIsUserInsideBuilding }: MapComponentProps) {
  const map = useMap();
  const { location: userLocation } = useContext(LocationContext);

  useEffect(() => {
    if (!map || !geoJsonData || !userLocation) return;

    map.data.forEach((feature) => map.data.remove(feature));

    // Load GeoJSON
    map.data.addGeoJson(geoJsonData);

    const userLatLng = new google.maps.LatLng(userLocation.lat, userLocation.lng);
    let userInsideBuilding = false;

    map.data.forEach((feature) => {
      const geometry = feature.getGeometry();
      if (geometry?.getType() === "Polygon") {
        const polygon = new google.maps.Polygon({
          paths: geometry.getArray().map((path) =>
            path.getArray().map((coord) => ({ lat: coord.lat(), lng: coord.lng() }))
          ),
        });

        if (google.maps.geometry.poly.containsLocation(userLatLng, polygon)) {
          userInsideBuilding = true;
          map.data.overrideStyle(feature, { fillColor: "red", fillOpacity: 0.8 });
        } else {
          map.data.overrideStyle(feature, { fillColor: "blue", fillOpacity: 0.5 });
        }
      }
    });

    setIsUserInsideBuilding(userInsideBuilding);
  }, [map, geoJsonData, userLocation]);

  return null;
}

export default MapComponent