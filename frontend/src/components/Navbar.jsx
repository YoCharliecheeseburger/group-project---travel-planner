import { NavLink } from 'react-router-dom'
import '../index.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbarContainer">
        
        <div className="navbarLogo">
          <NavLink to="/" className="logoLink">
            TravelPlanner
          </NavLink>
        </div>

        <ul className="navMenu">
          <li className="navItem">
            <NavLink to="/savedTrips" className="navLink">My Trips</NavLink>
          </li>
        </ul>

      </div>
    </nav>
  );
}

export default Navbar;
