import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import Trips from "./pages/Trips";
import AddTrip from "./pages/AddTrip";
import Caravan from "./pages/Caravan";
import Shopping from "./pages/Shopping";
import Settings from "./pages/Settings";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        <Route path="/trips" element={<Trips />} />
        <Route path="/trips/new" element={<AddTrip />} />

        <Route path="/caravan" element={<Caravan />} />

        <Route path="/shopping" element={<Shopping />} />

        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;