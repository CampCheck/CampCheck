import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import Trips from "./pages/Trips";
import AddTrip from "./pages/AddTrip";
import Garage from "./pages/Garage";
import VehicleDetails from "./pages/VehicleDetails";
import Checklists from "./pages/Checklists";
import Shopping from "./pages/Shopping";
import Settings from "./pages/Settings";
import Departure from "./pages/Departure";
import Arrival from "./pages/Arrival";
import LeavingCampsite from "./pages/LeavingCampsite";
import ArrivalHome from "./pages/ArrivalHome";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        <Route path="/trips" element={<Trips />} />
        <Route path="/trips/new" element={<AddTrip />} />
        <Route path="/trips/edit/:id" element={<AddTrip />} />

        <Route path="/garage" element={<Garage />} />
        <Route path="/garage/:id" element={<VehicleDetails />} />

        <Route path="/checklists" element={<Checklists />} />

        <Route path="/caravan/departure" element={<Departure />} />
        <Route path="/caravan/arrival" element={<Arrival />} />
        <Route path="/caravan/leaving" element={<LeavingCampsite />} />
        <Route path="/caravan/home" element={<ArrivalHome />} />

        <Route path="/shopping" element={<Shopping />} />

        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;