import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  FaHome,
  FaCaravan,
  FaShoppingCart,
  FaCog,
} from "react-icons/fa";
import logo from "../assets/campcheck-logo.png";

function Layout() {
  const location = useLocation();

  const isHome = location.pathname === "/";

  
  return (
    <div className="app-layout">

      {!isHome && (
  <header className="app-header">
    <img
      src={logo}
      alt="CampCheck"
      className="app-logo"
    />
  </header>
)}

      <main className="app-content">
        <Outlet />
      </main>

      <nav className="bottom-nav">
        <NavLink to="/">
          <div className="nav-icon">
            <FaHome />
          </div>
          <span>Home</span>
        </NavLink>

        <NavLink to="/caravan">
          <div className="nav-icon">
            <FaCaravan />
          </div>
          <span>Caravan</span>
        </NavLink>

        <NavLink to="/shopping">
          <div className="nav-icon">
            <FaShoppingCart />
          </div>
          <span>Shopping</span>
        </NavLink>

        <NavLink to="/settings">
          <div className="nav-icon">
            <FaCog />
          </div>
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default Layout;