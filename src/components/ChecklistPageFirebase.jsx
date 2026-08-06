import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ConfirmDialog from "./ConfirmDialog";
import ProgressBar from "./ProgressBar";
import SortableChecklistItem from "./SortableChecklistItem";

import {
  DndContext,
  closestCenter,
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

import {
  subscribeChecklist,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  updateChecklistOrder,
  initialiseChecklist,
} from "../firebase/checklists";

function ChecklistPage({ title, storageKey, items, backLink }) {
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [savedItems, setSavedItems] = useState([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState("");

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
    initialiseChecklist(storageKey, items);
  }, [storageKey, items]);

  useEffect(() => {
    const unsubscribe = subscribeChecklist(
      storageKey,
      (firebaseItems) => {
        setSavedItems(firebaseItems);
      },
      console.error
    );

    return unsubscribe;
  }, [storageKey]);

  async function toggle(itemText) {
    const item = savedItems.find((i) => i.text === itemText);

    if (!item) return;

    await updateChecklistItem(storageKey, item.id, {
      checked: !item.checked,
    });
  }

  async function editItem(oldText, newText) {
    if (!newText.trim()) return;

    const item = savedItems.find((i) => i.text === oldText);

    if (!item) return;

    await updateChecklistItem(storageKey, item.id, {
      text: newText.trim(),
    });
  }

  async function deleteItem(itemText) {
    const item = savedItems.find((i) => i.text === itemText);

    if (!item) return;

    await deleteChecklistItem(storageKey, item.id);
  }

 async function handleDragEnd(event) {
  const { active, over } = event;

  if (!over || active.id === over.id) return;

  const oldIndex = savedItems.findIndex(
    (i) => i.text === active.id
  );

  const newIndex = savedItems.findIndex(
    (i) => i.text === over.id
  );

  const reordered = arrayMove(savedItems, oldIndex, newIndex);

  // Update UI immediately
  setSavedItems(reordered);

  // Save new order to Firestore in one batch
  await updateChecklistOrder(storageKey, reordered);
}

async function confirmResetChecklist() {
  for (const item of savedItems) {
    await updateChecklistItem(storageKey, item.id, {
      checked: false,
    });
  }

  setShowResetDialog(false);
}

const allItems = savedItems.map((item) => item.text);

const completed = savedItems.filter(
  (item) => item.checked
).length;

const total = savedItems.length;

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
          onClick={async () => {
            if (!newItem.trim()) return;

            await addChecklistItem(storageKey, {
              text: newItem.trim(),
              checked: false,
              order: savedItems.length,
              custom: true,
            });

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
            {savedItems.map((item) => (
              <SortableChecklistItem
  id={item.id}
  key={item.id}
  checked={item.checked}
  text={item.text}
  isCustom={item.custom === true}
  onToggle={() => toggle(item.text)}
  onEdit={editItem}
  onDelete={() => deleteItem(item.text)}
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
          <button>Back</button>
        </Link>
      </div>

      <ConfirmDialog
        open={showResetDialog}
        title="🚐 CampCheck"
        message="Are you sure you want to reset this checklist? This will untick every item."
        onConfirm={confirmResetChecklist}
        onCancel={() => setShowResetDialog(false)}
      />
    </div>
  );
}

export default ChecklistPage;