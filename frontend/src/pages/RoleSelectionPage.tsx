// src/pages/RoleSelectionPage.tsx
import { Link } from 'react-router-dom';

const RoleSelectionPage = () => {
  return (
    <div className="role-selection-page">
      <h2>Choose Your Role</h2>
      {/* Navigate to SignUpPage when any button is clicked */}
      <Link to="/sign-up">
        <button>I am a Student</button>
      </Link>
      <Link to="/sign-up">
        <button>I am an Employee</button>
      </Link>
      <Link to="/sign-up">
        <button>I am an Outsider</button>
      </Link>

      <div>
        <p>Already have an account? <Link to="/login">Log In</Link></p>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
