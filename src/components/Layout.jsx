import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  FaHome,
  FaCaravan,
  FaShoppingCart,
  FaCog,
} from "react-icons/fa";

function Layout() {
  const location = useLocation();

  const isHome = location.pathname === "/";

  function getHeader() {
    switch (location.pathname) {
      case "/caravan":
        return "Caravan Checklists";

      case "/shopping":
        return "Shopping List";

      case "/trips":
        return "Trips";

      case "/trips/new":
        return "Add Trip";

      case "/settings":
        return "Settings";

      default:
        return "";
    }
  }

  return (
    <div className="app-layout">

      {!isHome && (
        <header className="app-header">
          <h1>{getHeader()}</h1>
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