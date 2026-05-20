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

  // เพิ่ม state สำหรับรูป
  const [image, setImage] = useState(null);

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

    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

  };

  // save update
  const handleSave = async () => {

    try {

      let imageUrl = form.image_url;

      // ถ้ามีเลือกรูปใหม่
      if (image) {

        const formData = new FormData();

        formData.append("image", image);

        const uploadRes = await axios.post(
          `${API}/upload`,
          formData
        );

        imageUrl = uploadRes.data.imageUrl;
      }

      // update menu
      await axios.put(
        `${API}/menu/${menu.id}`,
        {
          name: form.name,
          price: form.price,
          category: form.category,
          image_url: imageUrl
        }
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

        {/* upload รูปใหม่ */}
        <input
          type="file"
          onChange={(e) =>
            setImage(e.target.files[0])
          }
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