import { useEffect, useState } from "react";
import axios from "axios";
import API from "../api";

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

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    await axios.put(
      `${API}/menu/${menu.id}`,
      form
    );

    refresh();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <h2>Edit Menu</h2>

        <input name="name" value={form.name} onChange={handleChange} />
        <input name="price" value={form.price} onChange={handleChange} />
        <input name="category" value={form.category} onChange={handleChange} />
        <input name="image_url" value={form.image_url} onChange={handleChange} />

        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>

      </div>
    </div>
  );
}