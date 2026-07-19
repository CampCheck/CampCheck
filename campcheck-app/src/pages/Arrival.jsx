import ChecklistPage from "../components/ChecklistPage";
import { arrivalChecklist } from "../data/checklists";

function Arrival() {
  return (
    <ChecklistPage
      title="🏕️ Arrival at Campsite"
      storageKey="arrivalChecklist"
      items={arrivalChecklist}
      backLink="/caravan"
    />
  );
}

export default Arrival;