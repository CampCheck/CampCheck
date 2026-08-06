import DashboardCard from "../components/DashboardCard";
import {
  departureChecklist,
  arrivalChecklist,
  leavingChecklist,
  arrivalHomeChecklist,
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
  const leaving = getChecklistProgress(
  "leavingChecklist",
  leavingChecklist
);

const arrivalHome = getChecklistProgress(
  "arrivalHomeChecklist",
  arrivalHomeChecklist
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

<DashboardCard
  title="Leaving Campsite"
  icon="🚪"
  completed={leaving.completed}
  total={leaving.total}
  link="/caravan/leaving"
/>

<DashboardCard
  title="Arrival Home"
  icon="🏡"
  completed={arrivalHome.completed}
  total={arrivalHome.total}
  link="/caravan/home"
/>
    </div>
  );
}

export default Caravan;