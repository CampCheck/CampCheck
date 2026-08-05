import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaGripLines } from "react-icons/fa6";
import ChecklistItem from "./ChecklistItem";

export default function SortableChecklistItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: props.text,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
    >
      <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
  }}
>
  <div
    {...attributes}
    {...listeners}
    style={{
      cursor: "grab",
      display: "flex",
      alignItems: "center",
    }}
  >
    <FaGripLines
      style={{
        color: "#888",
      }}
    />
  </div>

  <div style={{ flex: 1 }}>
    <ChecklistItem {...props} />
  </div>
</div>
    </div>
  );
}