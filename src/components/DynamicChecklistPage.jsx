import { useGroup } from "../auth/GroupProvider";
import { getCampingStyle } from "../campingStyles";
import ChecklistPageFirebase from "./ChecklistPageFirebase";

const BACK_LINKS = {
  departure: "/checklists",
  arrival: "/checklists",
  leaving: "/checklists",
  arrivalHome: "/checklists",
};

export default function DynamicChecklistPage({ checklistKey }) {
  const { campingStyle } = useGroup();
  const checklist = getCampingStyle(campingStyle).checklists[checklistKey];
  return <ChecklistPageFirebase title={checklist.title} storageKey={checklist.id} items={checklist.items} backLink={BACK_LINKS[checklistKey]} />;
}
