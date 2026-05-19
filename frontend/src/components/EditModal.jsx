import { useEffect, useState } from "react";
import axios from "axios";

export default function EditModal({
  open,
  onClose,
  menu,
  refresh
}) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image_url: ""
  });

  // โหลดข้อมูลเข้า form
  useEffect(() => {
    if (menu) {
      setForm({
        name: menu.name || "",
        price: menu.price || "",
        category: menu.category || "",
        image_url: menu.image_url || ""
      });
    }
  }, [menu]);

  // input change
  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // save update
  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:5000/menu/${menu.id}`,
        form
      );

      refresh();
      onClose();

    } catch (err) {
      console.error(err);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <h2>Edit Menu</h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
        />

        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
        />

        <input
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          placeholder="Image URL"
        />

        <div className="modal-actions">
          <button onClick={handleSave}>
            Save
          </button>

          <button onClick={onClose}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}