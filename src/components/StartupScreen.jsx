import logo from "../assets/campcheck-logo.png";

function StartupScreen() {
  return (
    <div className="startup-screen" aria-busy="true">
      <img src={logo} alt="CampCheck" className="startup-logo" />
    </div>
  );
}

export default StartupScreen;
