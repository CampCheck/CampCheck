import ChecklistPageFirebase from "../components/ChecklistPageFirebase";
import { leavingChecklist } from "../data/checklists";

function LeavingCampsite() {
  return (
    <ChecklistPageFirebase
      title="Leaving Campsite"
      storageKey="leavingChecklist"
      items={leavingChecklist}
      backLink="/caravan"
    />
  );
}

export default LeavingCampsite;