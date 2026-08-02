import { Link } from "react-router-dom";
import logo from "../assets/campcheck-logo.png";

function Header() {
  return (
    <header className="app-header">
      <Link to="/">
        <img
          src={logo}
          alt="CampCheck"
          className="app-logo"
        />
      </Link>
    </header>
  );
}

export default Header;