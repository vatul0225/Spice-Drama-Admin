import React, { useEffect, useState } from "react";
import { Edit, Trash2, Eye, PlusCircle, Search, X } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import userApi from "../../services/userApi";

export default function List() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [viewItem, setViewItem] = useState(null);

  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const response = await userApi.get("/food/list");
      if (response.data.success) {
        setList(response.data.data);
      }
    } catch {
      toast.error("Server error");
    }
  };

  const remove = async (foodId) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      const response = await userApi.post("/food/remove", { id: foodId });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      }
    } catch {
      toast.error("Failed to remove item");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const filteredItems = list.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="h-full w-full min-w-0 overflow-y-auto overflow-x-hidden">
      <div className="space-y-4 px-4 py-4 pb-24">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Menu Items</h1>
          <button
            onClick={() => navigate("/add")}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg flex gap-2"
          >
            <PlusCircle size={18} />
            Add Item
          </button>
        </div>

        {/* SEARCH */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-full px-4 py-2 border rounded-lg"
        />

        {/* LIST */}
        <div className="grid gap-4">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 rounded-lg shadow flex gap-4"
            >
              {/* ✅ IMAGE FIX */}
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/150?text=No+Image")
                }
              />

              <div className="flex-1">
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-500">{item.category}</p>
                <p className="font-bold text-orange-600">₹{item.price}</p>
              </div>

              <div className="flex gap-2">
                <Eye onClick={() => setViewItem(item)} />
                <Edit onClick={() => navigate(`/add/${item._id}`)} />
                <Trash2 onClick={() => remove(item._id)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VIEW MODAL */}
      <AnimatePresence>
        {viewItem && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex justify-center items-center"
            onClick={() => setViewItem(null)}
          >
            <motion.div
              className="bg-white rounded-lg max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={viewItem.image} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-bold">{viewItem.name}</h2>
                <p>{viewItem.description}</p>
                <p className="font-bold text-orange-600 mt-2">
                  ₹{viewItem.price}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
