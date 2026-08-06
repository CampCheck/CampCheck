import ChecklistPage from "../components/ChecklistPage";
import { arrivalChecklist } from "../data/checklists";

function Arrival() {
  return (
    <ChecklistPage
      title="🏕️ Leaving Campsite"
      storageKey="LeavingChecklist"
      items={arrivalChecklist}
      backLink="/caravan"
    />
  );
}
[
  "Disconnect electric hook-up",
  "Disconnect water",
  "Drain waste water",
  "Empty toilet cassette",
  "Turn gas off",
  "Close roof vents",
  "Lock windows",
  "Lower TV aerial",
  "Raise corner steadies",
  "Remove wheel chocks",
  "Secure loose items",
  "Check pitch for forgotten items",
  "Attach breakaway cable",
  "Final walk-around",
]
export default Arrival;