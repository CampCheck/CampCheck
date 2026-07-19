import { Outlet, NavLink } from "react-router-dom";

function Layout() {
  return (
    <div className="app-layout">
      <header className="app-header">
  <h1>CampCheck</h1>
  <p>Your camping companion</p>
</header>

      <main className="app-content">
        <Outlet />
      </main>

      <nav className="bottom-nav">
        <NavLink to="/">🏠 Home</NavLink>
        <NavLink to="/caravan">🚐 Caravan</NavLink>
        <NavLink to="/shopping">🛒 Shopping</NavLink>
        <NavLink to="/notes">📝 Notes</NavLink>
        <NavLink to="/settings">⚙️ Settings</NavLink>
      </nav>
    </div>
  );
}

export default Layout;