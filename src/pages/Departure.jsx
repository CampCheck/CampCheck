import ChecklistPageFirebase from "../components/ChecklistPageFirebase";
import { departureChecklist } from "../data/checklists";

function Departure() {
  return (
    <ChecklistPageFirebase
      title="Before Leaving Home"
      storageKey="departureChecklist"
      items={departureChecklist}
      backLink="/caravan"
    />
  );
}

export default Departure;