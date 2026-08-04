import DashboardCard from "../components/DashboardCard";
import {
  departureChecklist,
  arrivalChecklist,
} from "../data/checklists";
import { getChecklistProgress } from "../utils/checklistProgress";

function Caravan() {
  const departure = getChecklistProgress(
    "departureChecklist",
    departureChecklist
  );

  const arrival = getChecklistProgress(
    "arrivalChecklist",
    arrivalChecklist
  );

  return (
    <div>
      
      <DashboardCard
        title="Before Leaving Home"
        icon="🏠"
        completed={departure.completed}
        total={departure.total}
        link="/caravan/departure"
      />

      <DashboardCard
        title="Arrival at Campsite"
        icon="🏕️"
        completed={arrival.completed}
        total={arrival.total}
        link="/caravan/arrival"
      />
    </div>
  );
}

export default Caravan;