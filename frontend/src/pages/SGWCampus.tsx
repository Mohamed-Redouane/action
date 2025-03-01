import { useEffect, useState, useContext } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { LocationContext } from "../Components/LocationContext";
import MapComponent from "../Components/MapComponent";

const CAMPUS_COORDINATES = { lat: 45.4949, lng: -73.5779 };

function SGWCampus() {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const { location: userLocation } = useContext(LocationContext);
  const [isUserInsideBuilding, setIsUserInsideBuilding] = useState(false);

  useEffect(() => {
    fetch("/Building.geojson")
      .then((response) => response.json())
      .then((data) => setGeoJsonData(data))
      .catch((error) => console.error("Error loading SGW GeoJSON:", error));
  }, []);

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={["geometry"]}>
      <Map
        defaultZoom={17}
        defaultCenter={CAMPUS_COORDINATES}
        mapTypeControl={false}
        fullscreenControl={false}
      >
        {geoJsonData && <MapComponent geoJsonData={geoJsonData} setIsUserInsideBuilding={setIsUserInsideBuilding} />}
        {isUserInsideBuilding && userLocation && <Marker position={userLocation} />}
      </Map>
    </APIProvider>
  );
}

export default SGWCampus



