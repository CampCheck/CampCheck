
import { useEffect, useMemo, useState } from "react";
import "./../styles/shopping.css";
import {
  FaRegTrashCan,
  FaRegPenToSquare,
  FaCheck,
  FaXmark
} from "react-icons/fa6";
import {
  subscribeShopping,
  addShoppingItem,
  updateShoppingItem,
  deleteShoppingItem,
  untickAllShopping,
} from "../firebase/shopping";
import { useGroup } from "../auth/GroupProvider";

export default function Shopping() {
  const { groupId } = useGroup();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  
  useEffect(() => {
  if (!groupId) return undefined;
  const unsubscribe = subscribeShopping(
    groupId,
    (shopping) => setItems(shopping),
    (error) => console.error(error)
  );

  return unsubscribe;
}, [groupId]);

  const addItem = async () => {
  if (!newItem.trim()) return;

  try {
    await addShoppingItem(groupId, {
  text: newItem.trim(),
  quantity,
  checked: false,
  packed: false,
});

    setNewItem("");
    setQuantity(1);
  } catch (error) {
    console.error(error);
    alert("Failed to add shopping item.");
  }
};

 const toggleItem = async (id) => {
  const item = items.find(i => i.id === id);

  if (!item) return;

  await updateShoppingItem(groupId, id, {
    checked: !item.checked,
  });
};

  const deleteItem = async (id) => {
  try {
    await deleteShoppingItem(groupId, id);
  } catch (error) {
    console.error(error);
    alert("Failed to delete item.");
  }
};

  function startEdit(item) {
  setEditingId(item.id);
  setEditingText(item.text);
}

async function saveEdit(id) {
  if (!editingText.trim()) return;

  try {
    await updateShoppingItem(groupId, id, {
      text: editingText.trim(),
    });

    setEditingId(null);
    setEditingText("");
  } catch (error) {
    console.error(error);
    alert("Failed to update item.");
  }
}

  const changeQty = async (id, delta) => {
  const item = items.find(i => i.id === id);

  if (!item) return;

  try {
    await updateShoppingItem(groupId, id, {
      quantity: Math.max(1, (item.quantity ?? 1) + delta),
    });
  } catch (error) {
    console.error(error);
    alert("Failed to update quantity.");
  }
};

  const untickAll = async () => {
  try {
    await untickAllShopping(groupId);
  } catch (error) {
    console.error(error);
    alert("Failed to untick all items.");
  }
};

const untickPacked = async () => {
  try {
    await Promise.all(
      items
        .filter((item) => item.packed)
        .map((item) =>
          updateShoppingItem(groupId, item.id, {
            packed: false,
          })
        )
    );
  } catch (error) {
    console.error(error);
    alert("Failed to untick packed items.");
  }
};

const filtered = useMemo(
  () =>
    items.filter((i) =>
      i.text.toLowerCase().includes(search.toLowerCase())
    ),
  [items, search]
);

const completed = items.filter((i) => i.checked).length;
return (
  <div className="shopping-page">

    <div className="shopping-title">
      <h1>Shopping</h1>
      <p>Everything you need for your next trip</p>
    </div>

    <div className="progress-card">
      <div className="progress-text">
        {completed} / {items.length} Purchased
      </div>
    </div>
      <input
        className="search"
        placeholder="Search..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="shopping-add">
  <input
    value={newItem}
    placeholder="Add item..."
    onChange={e => setNewItem(e.target.value)}
    onKeyDown={e => e.key === "Enter" && addItem()}
  />

  <div className="shopping-add-bottom">
    <div className="qty">
      <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
        -
      </button>

      <span>{quantity}</span>

      <button onClick={() => setQuantity(quantity + 1)}>
        +
      </button>
    </div>

    <button onClick={addItem}>
      Add
    </button>
  </div>
</div>

<div className="shopping-top-buttons">
  <button className="untick" onClick={untickAll}>
    Untick All
  </button>

  <button className="untick" onClick={untickPacked}>
    Untick Packed
  </button>
</div>

      <div className="shopping-list">
        {filtered.length === 0 ? (
          <p className="empty">No items found.</p>
        ) : (
          filtered.map(item => (
            <div
              key={item.id}
              className={`shopping-item ${item.checked ? "checked" : ""}`}
            >
              <label>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleItem(item.id)}
                />
                {editingId === item.id ? (
  <input
    className="edit-input"
    value={editingText}
    onChange={(e) => setEditingText(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") saveEdit(item.id);
    }}
    autoFocus
  />
) : (
  <span>{item.text}</span>
)}
              </label>

              <div className="qty">
                <button onClick={() => changeQty(item.id, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => changeQty(item.id, 1)}>+</button>
              </div>

             {editingId === item.id ? (
  <div className="shopping-actions">
  <button
    className="save-btn"
    onClick={() => saveEdit(item.id)}
  >
    <FaCheck />
  </button>

  <button
    className="cancel-btn"
    onClick={() => {
      setEditingId(null);
      setEditingText("");
    }}
  >
    <FaXmark />
  </button>
</div>
) : (
  <>
    <div className="shopping-actions">

  <button
  className="packed-btn"
  onClick={async () => {
    await updateShoppingItem(groupId, item.id, {
      packed: !item.packed,
    });
  }}
>
  {item.packed ? "📦✅" : "📦"}
</button>

  <button
    className="edit-btn"
    onClick={() => startEdit(item)}
  >
    <FaRegPenToSquare />
  </button>

  <button
    className="delete-btn"
    onClick={() => deleteItem(item.id)}
  >
    <FaRegTrashCan />
  </button>

</div>
  </>
)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
