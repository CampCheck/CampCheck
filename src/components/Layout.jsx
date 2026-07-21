import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  FaHome,
  FaCaravan,
  FaShoppingCart,
  FaCog,
} from "react-icons/fa";

function Layout() {
  const location = useLocation();

  function getHeader() {
    switch (location.pathname) {
      case "/":
        return {
          title: "CampCheck",
          subtitle: "Ready for your next adventure",
        };

      case "/caravan":
        return {
          title: "Caravan",
          subtitle: "Manage your caravan checklists",
        };

      case "/shopping":
        return {
          title: "Shopping List",
          subtitle: "Everything you need for your next trip",
        };

      case "/settings":
        return {
          title: "Settings",
          subtitle: "Personalise CampCheck",
        };

      case "/trips":
        return {
          title: "Trips",
          subtitle: "Manage your camping trips",
        };

      case "/trips/new":
        return {
          title: "New Trip",
          subtitle: "Plan your next adventure",
        };

      default:
        return {
          title: "CampCheck",
          subtitle: "",
        };
    }
  }

  const header = getHeader();

  return (
    <div className="app-layout">
      <header className="app-header">
        <h1>{header.title}</h1>
        {header.subtitle && <p>{header.subtitle}</p>}
      </header>

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