import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <span className="navbar-logo">🪳 I-COCKROACH</span>
          <span className="navbar-tagline">Instantly. Affordably. Locally.</span>
        </NavLink>

        <ul className="navbar-links">
          <li>
            <NavLink to="/" end className="navbar-link">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/jobs" className="navbar-link">
              Find Work
            </NavLink>
          </li>
          <li>
            <NavLink to="/post-job" className="navbar-link">
              Post a Job
            </NavLink>
          </li>
          <li>
            <NavLink to="/student-dashboard" className="navbar-link">
              Dashboard
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
