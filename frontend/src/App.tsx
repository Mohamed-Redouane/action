// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
// import { RequestPasswordResetPage } from './pages/RequestPasswordResetPage';
// import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { VerifyEmailPage } from './pages/Auth/VerifiyEmailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage/>}/>
        {/* <Route path="/forgot-password" element={<RequestPasswordResetPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
