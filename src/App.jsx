import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import Caravan from "./pages/Caravan";
import Departure from "./pages/Departure";
import Arrival from "./pages/Arrival";
import Trips from "./pages/Trips";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        <Route path="trips" element={<Trips />} />

        <Route path="caravan" element={<Caravan />} />
        <Route path="caravan/departure" element={<Departure />} />
        <Route path="caravan/arrival" element={<Arrival />} />

        <Route
          path="shopping"
          element={<h2>🛒 Shopping List (Coming Soon)</h2>}
        />

        <Route
          path="notes"
          element={<h2>📝 Notes (Coming Soon)</h2>}
        />

        <Route
          path="settings"
          element={<h2>⚙️ Settings (Coming Soon)</h2>}
        />
      </Route>
    </Routes>
  );
}

export default App;