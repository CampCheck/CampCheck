import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ConfirmDialog from "./ConfirmDialog";
import ProgressBar from "./ProgressBar";
import SortableChecklistItem from "./SortableChecklistItem";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

function ChecklistPage({ title, storageKey, items, backLink }) {
  const defaultChecks = Object.fromEntries(
    items.map((item) => [item, false])
  );

  const [checks, setChecks] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : defaultChecks;
  });

  const [showResetDialog, setShowResetDialog] = useState(false);
const [customItems, setCustomItems] = useState(() => {
  return JSON.parse(localStorage.getItem(`${storageKey}_custom`)) || [];
});

const [newItem, setNewItem] = useState("");
const [showAddItem, setShowAddItem] = useState(false);
const [savedItems, setSavedItems] = useState(() => {
  const saved = localStorage.getItem(`${storageKey}_items`);

  if (saved) {
    return JSON.parse(saved);
  }

  localStorage.setItem(
    `${storageKey}_items`,
    JSON.stringify(items)
  );
  
 
  return items;
});
const sensors = useSensors(
  useSensor(MouseSensor),
  useSensor(TouchSensor, {
    activationConstraint: {
      delay: 150,
      tolerance: 5,
    },
  })
);
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(checks));
  }, [checks, storageKey]);

  function toggle(item) {
    setChecks((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
    
  }
  function editItem(oldText, newText) {
  if (!newText.trim()) return;

  // Rename the item in the checklist
  setSavedItems((prev) =>
    prev.map((item) =>
      item === oldText ? newText.trim() : item
    )
  );

  // Rename it in the custom items list
  setCustomItems((prev) =>
    prev.map((item) =>
      item === oldText ? newText.trim() : item
    )
  );

  // Keep the ticked state
  setChecks((prev) => {
    const updated = { ...prev };

    updated[newText.trim()] = updated[oldText];

    delete updated[oldText];

    return updated;
  });
}

function deleteItem(item) {
  setSavedItems((prev) =>
    prev.filter((i) => i !== item)
  );

  setCustomItems((prev) =>
    prev.filter((i) => i !== item)
  );

  setChecks((prev) => {
    const updated = { ...prev };

    delete updated[item];

    return updated;
  });
}

function handleDragEnd(event) {
  const { active, over } = event;

  if (!over || active.id === over.id) return;

  setSavedItems((items) => {
    const oldIndex = items.indexOf(active.id);
    const newIndex = items.indexOf(over.id);

    return arrayMove(items, oldIndex, newIndex);
  });
}

useEffect(() => {
  localStorage.setItem(
    `${storageKey}_custom`,
    JSON.stringify(customItems)
  );
}, [customItems, storageKey]);

useEffect(() => {
  localStorage.setItem(
    `${storageKey}_items`,
    JSON.stringify(savedItems)
  );
}, [savedItems, storageKey]);
  function resetChecklist() {
    setChecks(defaultChecks);
    setShowResetDialog(false);
  }

  
  const allItems = savedItems;

const completed = allItems.filter(
  (item) => checks[item]
).length;

const total = allItems.length;

  return (
    <div className="container checklist-page">
      <h1>{title}</h1>

      <ProgressBar completed={completed} total={total} />
{showAddItem ? (
  <div className="shopping-add" style={{ marginBottom: "20px" }}>
    <input
      type="text"
      placeholder="Checklist item..."
      value={newItem}
      onChange={(e) => setNewItem(e.target.value)}
      autoFocus
    />

    <button
      onClick={() => {
        if (!newItem.trim()) return;

        const item = newItem.trim();

        setSavedItems((prev) => [...prev, item]);

        setCustomItems((prev) => [...prev, item]);

        setChecks((prev) => ({
          ...prev,
          [item]: false,
        }));

        setNewItem("");
        setShowAddItem(false);
      }}
    >
      Save
    </button>

    <button
      onClick={() => {
        setNewItem("");
        setShowAddItem(false);
      }}
    >
      Cancel
    </button>
  </div>
) : (
  <button
    className="add-checklist-btn"
    onClick={() => setShowAddItem(true)}
  >
    ➕ Add Checklist Item
  </button>
)}

      <DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
  <SortableContext
    items={allItems}
    strategy={verticalListSortingStrategy}
  >
    <div className="checklist-list">
      {allItems.map((item) => (
        <SortableChecklistItem
          key={item}
          checked={checks[item]}
          text={item}
          isCustom={customItems.includes(item)}
          onToggle={() => toggle(item)}
          onEdit={editItem}
          onDelete={() => deleteItem(item)}
        />
      ))}
    </div>
  </SortableContext>
</DndContext>

      <div className="checklist-buttons">
  <button onClick={() => setShowResetDialog(true)}>
    Reset Checklist
  </button>

  <Link to={backLink}>
    <button>
      Back
    </button>
  </Link>
</div>

      <ConfirmDialog
        open={showResetDialog}
        title="🚐 CampCheck"
        message="Are you sure you want to reset this checklist? This will untick every item."
        onConfirm={resetChecklist}
        onCancel={() => setShowResetDialog(false)}
      />
    </div>
  );
}

export default ChecklistPage;