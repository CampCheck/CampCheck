import { useEffect, useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  FaHome,
  FaWarehouse,
  FaShoppingCart,
  FaCog,
} from "react-icons/fa";
import logo from "../assets/campcheck-logo.png";

function Layout() {
  const location = useLocation();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

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

      {isOffline && (
        <div className="offline-banner">
          🔴 Offline — changes will sync when you're back online
        </div>
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

        <NavLink to="/garage">
          <div className="nav-icon">
            <FaWarehouse />
          </div>
          <span>Garage</span>
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