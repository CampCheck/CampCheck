import ChecklistPage from "../components/ChecklistPage";
import { arrivalChecklist } from "../data/checklists";

function Arrival() {
  return (
    <ChecklistPage
      title="🏕️ Arrival Home"
      storageKey="arrivalHomeChecklist"
      items={arrivalChecklist}
      backLink="/caravan"
    />
  );
}
[
  "Empty caravan",
  "Empty fridge",
  "Leave fridge door open",
  "Drain fresh water system",
  "Drain water heater",
  "Empty waste water",
  "Empty toilet cassette",
  "Clean toilet",
  "Turn off battery isolator",
  "Remove valuables",
  "Vacuum caravan",
  "Check for damage",
  "Lock caravan",
  "Book next trip",
]
export default Arrival;