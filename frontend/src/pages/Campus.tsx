import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { useState, useContext, useEffect } from "react";
import { LocationContext } from "../components/LocationContext";
import MapComponent from "../components/MapComponent";
import ToggleCampus from "../components/ToggleCampusComponent";

type CampusType = 'SGW' | 'LOYOLA'; // Define a type for campus to ensure only these two values are valid

// Define the coordinates for each campus
const CAMPUS_COORDINATES: { [key in CampusType]: { lat: number, lng: number } } = {
    SGW: { lat: 45.4949, lng: -73.5779 },
    LOYOLA: { lat: 45.4583, lng: -73.6403 }
};

function CampusMap() {
    const [geoJsonData, setGeoJsonData] = useState<any>(null);
    const { location: userLocation } = useContext(LocationContext);
    const [isUserInsideBuilding, setIsUserInsideBuilding] = useState(false);
    const [campus, setCampus] = useState<string>("SGW");
    const [center, setCenter] = useState(CAMPUS_COORDINATES[campus as CampusType]);

    useEffect(() => {
        fetch("/Building.geojson")
            .then((response) => response.json())
            .then((data) => { setGeoJsonData(data); console.log("CampusMap.tsx: setGeoJsonData"); })
            .catch((error) => console.log("Error loading Campus GeoJSON:", error));
        console.log("CampusMap.tsx: fetch Building.geojson");
    }, []);

    function handleToggle() {
        // console.log("CampusMap.tsx: 1 handleToggle--> campus: ", campus);
        // setCampus((prevCampus) => (prevCampus === "SGW" ? "LOYOLA" : "SGW"));
        // setCenter(CAMPUS_COORDINATES[campus as CampusType]);
        setCampus((prevCampus) => {
            const newCampus = prevCampus === "SGW" ? "LOYOLA" : "SGW";
            setCenter(CAMPUS_COORDINATES[newCampus as CampusType]); // Ensure center updates correctly
            return newCampus;
        });
    }

    const onChange = (args: any) => {
        console.log(args.map.center);
        setCenter(args.map.center);
            
    };
    return (

        <div
            style={{ height: '86vh', width: '100vw', zIndex: -1 }}
            id="map"
            data-center={campus}
        >
            <ToggleCampus
                campus={campus}
                onClick={handleToggle}
            />
            <APIProvider
                apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                libraries={["geometry"]}>
                <Map
                    defaultZoom={17}
                    center={center}
                    mapTypeControl={false}
                    fullscreenControl={false}
                    onCenterChanged={onChange}
                >
                    {geoJsonData && <MapComponent geoJsonData={geoJsonData} setIsUserInsideBuilding={setIsUserInsideBuilding} />}
                    {isUserInsideBuilding && userLocation && <Marker position={userLocation} />}
                </Map>
            </APIProvider>

        </div>
    );
}

export default CampusMap;