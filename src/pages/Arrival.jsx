import ChecklistPageFirebase from "../components/ChecklistPageFirebase";
import { arrivalChecklist } from "../data/checklists";

function Arrival() {
  return (
    <ChecklistPageFirebase
      title="Arrival at Campsite"
      storageKey="arrivalChecklist"
      items={arrivalChecklist}
      backLink="/caravan"
    />
  );
}

export default Arrival;