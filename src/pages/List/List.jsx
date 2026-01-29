import React, { useEffect, useState } from "react";
import { Edit, Trash2, Eye, PlusCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import adminApi from "../../services/adminApi"; // ✅ CORRECT

export default function List() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [viewItem, setViewItem] = useState(null);
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const res = await adminApi.get("/food/list"); // ✅
      if (res.data.success) setList(res.data.data);
    } catch {
      toast.error("Failed to load food list");
    }
  };

  const removeItem = async (id) => {
    if (!window.confirm("Delete item?")) return;
    try {
      const res = await adminApi.post("/food/remove", { id }); // ✅
      if (res.data.success) {
        toast.success("Item removed");
        fetchList();
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const filtered = list.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Menu Items</h1>
        <button
          onClick={() => navigate("/add")}
          className="bg-orange-500 text-white px-4 py-2 rounded flex gap-2"
        >
          <PlusCircle size={18} /> Add Item
        </button>
      </div>

      <input
        className="w-full border p-2 rounded"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid gap-4">
        {filtered.map((item) => (
          <div
            key={item._id}
            className="bg-white p-4 rounded shadow flex gap-4"
          >
            <img
              src={item.image}
              className="w-20 h-20 object-cover rounded"
              onError={(e) =>
                (e.target.src = "https://via.placeholder.com/150?text=No+Image")
              }
            />
            <div className="flex-1">
              <h2 className="font-semibold">{item.name}</h2>
              <p className="text-sm">{item.category}</p>
              <p className="text-orange-600 font-bold">₹{item.price}</p>
            </div>
            <div className="flex gap-2">
              <Eye onClick={() => setViewItem(item)} />
              <Edit onClick={() => navigate(`/add/${item._id}`)} />
              <Trash2 onClick={() => removeItem(item._id)} />
            </div>
          </div>
        ))}
      </div>

      {viewItem && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center"
          onClick={() => setViewItem(null)}
        >
          <div
            className="bg-white rounded w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={viewItem.image} className="h-48 w-full object-cover" />
            <div className="p-4">
              <h2 className="font-bold">{viewItem.name}</h2>
              <p>{viewItem.description}</p>
              <p className="text-orange-600 font-bold mt-2">
                ₹{viewItem.price}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
