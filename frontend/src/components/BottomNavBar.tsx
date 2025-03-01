import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bus, Map, Navigation, Calendar } from 'lucide-react';

const BottomNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMapMenu, setOpenMapMenu] = useState(false);

  // This computed value is now actually used in the JSX below
  const mapLabel = useMemo(() => {
    if (location.pathname === '/') return 'Map: SGW';
    if (location.pathname === '/LOYcampus') return 'Map: Loyola';
    return 'Map';
  }, [location.pathname]);

  const handleNavigation = (value: string) => {
    if (value === '/') {
      setOpenMapMenu((prev) => !prev);
      navigate(value);
    } else {
      if (openMapMenu) setOpenMapMenu(false);
      navigate(value);
    }
  };

  const NavButton = ({ icon: Icon, label, value, isActive }: { 
    icon: React.ElementType; 
    label: string; 
    value: string; 
    isActive: boolean 
  }) => (
    <button
      onClick={() => handleNavigation(value)}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
      className={`rounded-none flex flex-1 flex-col items-center justify-center px-2 py-1 transition-all duration-300
        ${isActive ? 'text-white bg-[#4c3ee2]' : 'text-gray-500'}
        hover:text-white hover:bg-gradient-to-r hover:from-[#4361ee] hover:to-[#7209b7] hover:bg-opacity-80`}
    >
      <Icon className={`h-6 w-6 mb-1 transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100'}`} />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <nav className="flex h-16 bg-white shadow-lg backdrop-blur-md">
        <NavButton icon={Bus} label="Shuttle" value="/shuttle" isActive={location.pathname === '/shuttle'} />
        {/* Use the computed mapLabel here */}
        <NavButton 
          icon={Map} 
          label={mapLabel}  // Changed from "Map" to use the computed value
          value="/" 
          isActive={location.pathname === '/'} 
        />
        <NavButton icon={Navigation} label="Directions" value="/directions" isActive={location.pathname === '/directions'} />
        <NavButton icon={Calendar} label="Schedule" value="/schedule" isActive={location.pathname === '/schedule'} />
      </nav>
    </div>
  );
};

export default BottomNavBar;