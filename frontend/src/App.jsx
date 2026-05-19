import { useEffect, useState } from "react";
import axios from "axios";

import MenuCard from "./components/MenuCard";
import EditModal from "./components/EditModal";
import AddModal from "./components/AddModal";


function App() {
  const API = "https://cafe-admin-3odu.onrender.com";
  const headerImages = [
    "/img/bg1.jpg",
    "/img/bg2.jpg",
    "/img/bg3.jpg",
    "/img/bg4.jpg",
    "/img/bg5.jpg"
  ];
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {

    const interval = setInterval(() => {
      setCurrentBg((prev) =>
        (prev + 1) % headerImages.length
      );
    }, 3000);

    return () => clearInterval(interval);

  }, []);
  const [menus, setMenus] = useState([]);
  const [selectedCategory, setSelectedCategory]
    = useState("All");
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const categories = [
    "All",
    "Coffee",
    "Tea",
    "Milk",
    "Soda"
  ];

  const [image, setImage]
    = useState(null);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {

    const response = await axios.get(
      `${API}/menu`
    );
    console.log(response.data);
    setMenus(response.data);
  };

  const addMenu = async () => {

    let imageUrl = "";

    if (image) {

      const formData = new FormData();

      formData.append(
        "image",
        image
      );

      const uploadRes =
        await axios.post(
          `${API}/upload`, formData
        );

      imageUrl =
        uploadRes.data.imageUrl;
    }

    await axios.post(`${API}/menu`, {
      name,
      price,
      image_url: imageUrl,
      category
    });

    fetchMenus();

    setName("");
    setPrice("");
    setCategory("");
  };

  const deleteMenu = async (id) => {

    await axios.delete(
      `${API}/menu/${id}`
    );

    fetchMenus();
  };
  const updateMenu = async () => {

    await axios.put(
      `${API}/menu/${editingId}`,
      {
        name,
        price,
        category
      }
    );

    fetchMenus();

    setEditingId(null);

    setName("");
    setPrice("");
    setCategory("");
  };
  const filteredMenus = menus.filter((menu) => {
    const matchCategory =
      selectedCategory === "All" ||
      menu.category.trim().toLowerCase() ===
      selectedCategory.trim().toLowerCase();

    const matchSearch =
      menu.name.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });
  return (

    <div className="container">

      <div className="header">

        <img
          src="/img/Logo.jpg"
          alt="logo"
          className="logo"
        />

        <h1
          style={{
            backgroundImage: `url(${headerImages[currentBg]})`
          }}
        >
          Thammada.tmd cafe
        </h1>

      </div>
      <div className="navbar">

        {
          categories.map((category) => (

            <button
              key={category}
              onClick={() =>
                setSelectedCategory(category)
              }
            >
              {category}
            </button>

          ))
        }

        <div className="form">
          <input
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button onClick={() => setIsAddOpen(true)}>
            Add Menu
          </button>

        </div>

      </div>




      {
        <div className="grid">

          {
            filteredMenus.map((menu) => (
              <MenuCard
                key={menu.id}
                menu={menu}
                deleteMenu={deleteMenu}
                setSelectedMenu={setSelectedMenu}
                setIsEditOpen={setIsEditOpen}

              />
            ))
          }

        </div>

      }
      <EditModal
        open={isEditOpen}
        menu={selectedMenu}
        onClose={() => setIsEditOpen(false)}
        refresh={fetchMenus}
      />

      <AddModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        refresh={fetchMenus}
      />

    </div>
  );
}

export default App;