
import { useEffect, useMemo, useState } from "react";
import "./../styles/shopping.css";
import {
  FaRegTrashCan,
  FaRegPenToSquare,
  FaCheck,
  FaXmark
} from "react-icons/fa6";

export default function Shopping() {
  const [items, setItems] = useState(() => {
  const saved =
    JSON.parse(localStorage.getItem("shoppingList")) || [];

  return saved.map(item => ({
    ...item,
    quantity: item.quantity ?? 1,
  }));
});
  const [newItem, setNewItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  
  useEffect(() => {
    localStorage.setItem("shoppingList", JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (!newItem.trim()) return;
    setItems([
      ...items,
      {
        id: Date.now(),
        text: newItem.trim(),
        quantity,
        checked: false,
      },
    ]);
    setNewItem("");
    setQuantity(1);
  };

  const toggleItem = id =>
    setItems(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i));

  const deleteItem = id =>
    setItems(items.filter(i => i.id !== id));

  function startEdit(item) {
  setEditingId(item.id);
  setEditingText(item.text);
}

function saveEdit(id) {
  if (!editingText.trim()) return;

  setItems(
    items.map(item =>
      item.id === id
        ? { ...item, text: editingText.trim() }
        : item
    )
  );

  setEditingId(null);
  setEditingText("");
}

  const changeQty = (id, delta) =>
    setItems(items.map(i =>
      i.id === id
        ? { ...i, quantity: Math.max(1, (i.quantity ?? 1) + delta) }
        : i
    ));

  const untickAll = () =>
    setItems(items.map(i => ({ ...i, checked: false })));

  const filtered = useMemo(
    () =>
      items.filter(i =>
        i.text.toLowerCase().includes(search.toLowerCase())
      ),
    [items, search]
  );

  const completed = items.filter(i => i.checked).length;
  const percent = items.length
    ? Math.round((completed / items.length) * 100)
    : 0;

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

        <div className="qty">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>

        <button onClick={addItem}>Add</button>
      </div>

      <button className="untick" onClick={untickAll}>
        Untick All
      </button>

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
