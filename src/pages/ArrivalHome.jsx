import ChecklistPageFirebase from "../components/ChecklistPageFirebase";
import { arrivalHomeChecklist } from "../data/checklists";

function ArrivalHome() {
  return (
    <ChecklistPageFirebase
      title="Arrival Home"
      storageKey="arrivalHomeChecklist"
      items={arrivalHomeChecklist}
      backLink="/caravan"
    />
  );
}

export default ArrivalHome;