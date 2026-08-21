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
import { useGroup } from "../auth/GroupProvider";

function ChecklistPage({ title, storageKey, items, backLink }) {
  const { groupId } = useGroup();
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
    if (groupId) initialiseChecklist(groupId, storageKey, items).catch(console.error);
  }, [groupId, storageKey, items]);

  useEffect(() => {
    if (!groupId) return undefined;
    const unsubscribe = subscribeChecklist(
      groupId,
      storageKey,
      (firebaseItems) => {
        setSavedItems(firebaseItems);
      },
      console.error
    );

    return unsubscribe;
  }, [groupId, storageKey]);

  async function toggle(itemText) {
    const item = savedItems.find((i) => i.text === itemText);

    if (!item) return;

    await updateChecklistItem(groupId, storageKey, item.id, {
      checked: !item.checked,
    });
  }

  async function editItem(oldText, newText) {
    if (!newText.trim()) return;

    const item = savedItems.find((i) => i.text === oldText);

    if (!item) return;

    await updateChecklistItem(groupId, storageKey, item.id, {
      text: newText.trim(),
    });
  }

  async function deleteItem(itemText) {
    const item = savedItems.find((i) => i.text === itemText);

    if (!item) return;

    await deleteChecklistItem(groupId, storageKey, item.id);
  }

 async function handleDragEnd(event) {
  const { active, over } = event;

  if (!over || active.id === over.id) return;

  const oldIndex = savedItems.findIndex(
    (i) => i.id === active.id
  );

  const newIndex = savedItems.findIndex(
    (i) => i.id === over.id
  );

  const reordered = arrayMove(savedItems, oldIndex, newIndex);

  // Update UI immediately
  setSavedItems(reordered);

  // Save new order to Firestore in one batch
  await updateChecklistOrder(groupId, storageKey, reordered);
}

async function confirmResetChecklist() {
  for (const item of savedItems) {
    await updateChecklistItem(groupId, storageKey, item.id, {
      checked: false,
    });
  }

  setShowResetDialog(false);
}

const allItems = savedItems.map((item) => item.id);

const completed = savedItems.filter(
  (item) => item.checked
).length;

const total = savedItems.length;

return (
  <div className="container checklist-page">
    <h1>{title}</h1>

    <ProgressBar completed={completed} total={total} />

   <div className="checklist-add">
  <input
    type="text"
    placeholder="Add item..."
    value={newItem}
    onChange={(e) => setNewItem(e.target.value)}
  />

  <button
    onClick={async () => {
      if (!newItem.trim()) return;

      await addChecklistItem(groupId, storageKey, {
        text: newItem.trim(),
        checked: false,
        order: savedItems.length,
        custom: true,
      });

      setNewItem("");
    }}
  >
    Add
  </button>
</div>

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

        
      </div>

      <ConfirmDialog
  open={showResetDialog}
  
  message="Are you sure you want to reset this checklist? This will untick every item."
  onConfirm={confirmResetChecklist}
  onCancel={() => setShowResetDialog(false)}
/>
    </div>
  );
}

export default ChecklistPage;
