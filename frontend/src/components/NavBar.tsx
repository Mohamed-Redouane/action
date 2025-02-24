import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, LogOut } from 'lucide-react';
import { useAuthContext } from '../context/authContext';
import { useAuthService } from '../services/authService';

const NavBar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useAuthContext();
  const { handleLogout } = useAuthService();
  const navigate = useNavigate();

  async function onLogoutClick() {
    try {
      await handleLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md shadow-lg overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-r from-[#4361ee] to-[#7209b7] opacity-90"
        style={{
          animation: 'gradient 10s linear infinite',
          backgroundSize: '200% 100%'
        }}
      />
      <div className="container mx-auto flex h-16 items-center justify-between px-4 relative">
        <a href="/" className="flex items-center space-x-3">
          <div className="relative animate-bounce">
            <MapPin className="h-8 w-8 text-white" />
            <div 
              className="absolute inset-0 bg-blue-400 rounded-full filter blur-md"
              style={{
                animation: 'pulse 2s ease-in-out infinite'
              }}
            />
          </div>
          <span
            className="text-2xl font-extrabold text-white tracking-wider"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            ONCampus
          </span>
        </a>
        
        {user && (
          <button
            onClick={onLogoutClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group flex items-center px-6 py-2 rounded-full bg-white text-[#4361ee] font-semibold transition-all duration-300 focus:outline-none hover:bg-opacity-90"
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.3s ease'
            }}
          >
            <span className="font-medium">Logout</span>
            <LogOut className="h-5 w-5 ml-2" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;