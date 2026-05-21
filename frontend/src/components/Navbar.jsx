import { NavLink } from 'react-router-dom'

function PokeNavbar() {
  return (
    <nav className="navbar">
      <div className="center">
        <NavLink to="/">Home</NavLink>
      </div>
    </nav>
  );
}

export default PokeNavbar;
