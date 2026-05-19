function MenuCard({
    menu,
    deleteMenu,
    setSelectedMenu,
    setIsEditOpen
}) {

    return (
        <div className="card">

            {/* <img
                src={menu.image_url}
                alt={menu.name}
                width="150"
            /> */}
            <img
                src={menu.image_url || null}
                alt={menu.name}
            />
            <h3>{menu.name}</h3>

            <p>{menu.price} บาท</p>
            <button
                onClick={() => deleteMenu(menu.id)}
            >
                Delete
            </button>
            <button
                onClick={() => {
                    setSelectedMenu(menu);
                    setIsEditOpen(true);
                }}
            >
                Edit
            </button>

        </div>
    );
}

export default MenuCard;