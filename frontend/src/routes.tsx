// src/routes.tsx
import { createBrowserRouter } from 'react-router-dom';

import App from './App';
import { requireAuthLoader } from './loaders/authLoader';


import CampusMap from './pages/Campus';

// Public Pages
//import WelcomePage from './pages/WelcomePage';
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { RequestPasswordResetPage } from './pages/Auth/RequestPasswordResetPage';
import { ResetPasswordPage } from './pages/Auth/ResetPasswordPage';
import { VerifyEmailPage } from './pages/Auth/VerifyEmailPage';


export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      //protected routes (will run requireAuthLoader first)
      {
        path: "/",
        loader: requireAuthLoader,
        element: (
          <div style={{ height: '86vh', width: '100vw' }}>
            <CampusMap />
          </div>
        ),
      },
    
      {
        path: "/shuttle",
        loader: requireAuthLoader,
        element: (
          <div style={{ height: '86vh', width: '100vw' }}>
            404 Not Found
          </div>
        ),
      },
      {
        path: "/directions",
        loader: requireAuthLoader,
        element: (
          <div style={{ height: '86vh', width: '100vw' }}>
            404 Not Found
          </div>
        ),
      },
      {
        path: "/schedule",
        loader: requireAuthLoader,
        element: (
          <div style={{ height: '86vh', width: '100vw' }}>
            404 Not Found
          </div>
        ),
      },

      // {
      //   path: "/main",
      //   element: <WelcomePage />,
      // },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/forgot-password",
        element: <RequestPasswordResetPage />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
      },
      {
        path: "/verify-email",
        element: <VerifyEmailPage />,
      },
    ],
  },
]);
