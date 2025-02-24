import "./App.css";
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./Components/NavBar";
import BottomNavBar from "./Components/BottomNavBar";
import UserLocation from "./Components/UserLocation";
import Modal from "./Components/Modal"; 
import { LocationProvider } from "./Components/LocationContext";

function App() {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // List of routes where NavBar/BottomNavBar should be hidden
  const hideNavbarPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
  ];
  const isAuthRoute = hideNavbarPaths.includes(location.pathname);

  return (
    <LocationProvider>
      <div className="flex flex-col top-0 left-0 w-screen h-screen">
       
        {!isAuthRoute && <NavBar />}
        {!isAuthRoute && <UserLocation />}

        
        {!isAuthRoute && isModalOpen && (
          <div className="fixed top-20 left-0 w-full flex justify-center items-center z-40">
            <Modal 
              message="Are you on campus?" 
              onConfirm={() => setIsModalOpen(false)} 
              onCancel={() => setIsModalOpen(false)} 
            />
          </div>
        )}

        
        <div className="flex-grow">
          <Outlet />
        </div>

       
        {!isAuthRoute && <BottomNavBar />}
      </div>
    </LocationProvider>
  );
}

export default App


