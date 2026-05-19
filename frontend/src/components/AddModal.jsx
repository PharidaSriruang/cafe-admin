import { useState } from "react";
import axios from "axios";
import API from "../api";

function AddModal({ open, onClose, refresh }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  if (!open) return null;

  const addMenu = async () => {
    let imageUrl = "";

    if (image) {
      const formData = new FormData();
      formData.append("image", image);

      const uploadRes = await axios.post(
        `${API}/upload`,
        formData
      );

      imageUrl = uploadRes.data.imageUrl;
    }

    await axios.post(`${API}/menu`, {
      name,
      price,
      category,
      image_url: imageUrl
    });

    refresh();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Menu</h2>

        <input placeholder="Menu name" onChange={(e) => setName(e.target.value)} />
        <input placeholder="Price" type="number" onChange={(e) => setPrice(e.target.value)} />
        <input placeholder="Category" onChange={(e) => setCategory(e.target.value)} />

        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        <button onClick={addMenu}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default AddModal;