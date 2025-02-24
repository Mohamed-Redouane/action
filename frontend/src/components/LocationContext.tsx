import React, { createContext, useState } from "react";

interface Location {
  lat: number;
  lng: number;
}

interface LocationContextType {
  location: Location | null;
  setLocation: (location: Location | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const LocationContext = createContext<LocationContextType>({
  location: null,
  setLocation: () => {},
  error: null,
  setError: () => {},
});

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  console.log("LocationProvider: location updated:", location);

  return (
    <LocationContext.Provider value={{ location, setLocation, error, setError }}>
      {children}
    </LocationContext.Provider>
  );
};