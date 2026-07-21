import { useEffect, useState } from "react";
import "./../styles/shopping.css";

function Shopping() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("shoppingList")) || [];
    setItems(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("shoppingList", JSON.stringify(items));
  }, [items]);

  function addItem() {
    if (!newItem.trim()) return;

    setItems([
      ...items,
      {
        id: Date.now(),
        text: newItem,
        checked: false,
      },
    ]);

    setNewItem("");
  }

  function toggleItem(id) {
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, checked: !item.checked }
          : item
      )
    );
  }

  function deleteItem(id) {
    setItems(items.filter((item) => item.id !== id));
  }

  const completed = items.filter((item) => item.checked).length;

  return (
    <div className="shopping-page">

      <div className="shopping-add">

        <input
          type="text"
          placeholder="Add an item..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
        />

        <button onClick={addItem}>
          Add
        </button>

      </div>

      <div className="shopping-list">

        {items.length === 0 ? (
          <p className="empty">
            Your shopping list is empty.
          </p>
        ) : (
          items.map((item) => (
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

                <span>{item.text}</span>
              </label>

              <button
                className="delete-btn"
                onClick={() => deleteItem(item.id)}
              >
                ✕
              </button>
            </div>
          ))
        )}

      </div>

      <div className="shopping-footer">
        {completed} of {items.length} purchased
      </div>

    </div>
  );
}

export default Shopping;