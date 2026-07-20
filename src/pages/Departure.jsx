import ChecklistPage from "../components/ChecklistPage";
import { departureChecklist } from "../data/checklists";

function Departure() {
  return (
    <ChecklistPage
      title="🚗 Before Leaving Home"
      storageKey="departureChecklist"
      items={departureChecklist}
      backLink="/caravan"
    />
  );
}

export default Departure;