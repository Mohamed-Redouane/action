import { useEffect, useContext, useState } from "react";
import Modal from "./Modal";
import { LocationContext } from "./LocationContext";
import { distanceCalculation } from "../utils/distanceCalculation";


function UserLocation() {
  const { setLocation, error, setError } = useContext(LocationContext);
  const [isOnCampus, setIsOnCampus] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [hasReceivedLocation, setHasReceivedLocation] = useState<boolean>(false);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [showOnCampusMessage, setShowOnCampusMessage] = useState<boolean>(false);
  const [showOffCampusMessage, setShowOffCampusMessage] = useState<boolean>(false);


  useEffect(() => {
    fetch("/Building.geojson")
      .then((response) => response.json())
      .then((data) => {
        setGeoJsonData(data);
      })
      .catch((error) => {
        console.error("Error loading GeoJSON data:", error);
      });
  }, []);

  useEffect(() => {
    if (isOnCampus !== null) {
      if (isOnCampus) {
        setShowOnCampusMessage(true);
        setTimeout(() => setShowOnCampusMessage(false), 5000);
      } else {
        setShowOffCampusMessage(true);
        setTimeout(() => setShowOffCampusMessage(false), 5000);
      }
    }
  }, [isOnCampus]);



  const isFarFromCampusBuildings = (userLat: number, userLng: number): boolean => {
    if (!geoJsonData) return false; 

    const thresholdDistance = 0.5;
    let isFar = true;

    geoJsonData.features.forEach((feature: any) => {
      const geometry = feature.geometry;
      if (geometry.type === "Polygon") {
        geometry.coordinates[0].forEach((coord: [number, number]) => {
          const [lng, lat] = coord;
          const distance = distanceCalculation(userLat, userLng, lat, lng);
          if (distance <= thresholdDistance) {
            isFar = false;
          }
        });
      }
    });

    return isFar;
  };

  useEffect(() => {

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    const success = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;
      console.log(`New Location: Lat: ${latitude}, Lng: ${longitude}, Accuracy: ${accuracy}m`);

      setHasReceivedLocation(true);

      if (accuracy > 2000) {
        console.warn("Waiting for better accuracy...");
        if (isOnCampus === null) {
          setShowModal(true);
        }
        return;
      }
      
      if (isFarFromCampusBuildings(latitude, longitude)) {
        console.warn("User is far from campus buildings.");
        setShowModal(true);
        return;
      }

      setLocation({ lat: latitude, lng: longitude });
      setError(null);
      setShowModal(false);
    };

    const handleError = (err: GeolocationPositionError) => {
      setError("Failed to get location. Please allow access and try later.");
      console.error(err);
    };

    const id = navigator.geolocation.watchPosition(success, handleError, {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0,
    });

    setWatchId(id);

    return () => {
      navigator.geolocation.clearWatch(id);
      console.log("Stopped watching location.");
    };
  }, [setLocation, setError, geoJsonData]);

  const handleConfirm = () => {
    setIsOnCampus(true);
    setShowModal(false);
  };

  const handleCancel = () => {
    setIsOnCampus(false);
    setShowModal(false);
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      console.log("Location tracking stopped.");
    }
  };

  const renderMessages = () => {
    if (error) {
      return <Message message={error}/>;
    }
    if(!hasReceivedLocation || showModal){
      return null;
    }

    return (
      <>
        {showOffCampusMessage && <Message message={"You are not on campus."} />}
        {showOnCampusMessage && <Message  message="Please move closer to a window or an open area to improve GPS accuracy." />}
      </>
    );
  };

  return (
    <div>
      {renderMessages()}

      {showModal && (
        <Modal
          message="Are you on campus?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

function Message({ message }: Readonly<{ message: string }>) {
  return (
    <div id="message" className="fixed flex justify-center self-center bottom-14 m-2 transform -translate-x-1/2 bg-blue-500  text-black px-4 py-2 rounded-md shadow-md transition-opacity duration-500 z-10">
        <p className="align-middle">
          {message}
        </p>
    </div>
  );
}

export default UserLocation;
