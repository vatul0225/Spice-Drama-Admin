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

  /* ---------------- FETCH LIST ---------------- */
  const fetchList = async () => {
    try {
      const response = await userApi.get("/food/list");
      if (response.data.success) {
        setList(response.data.data);
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  /* ---------------- REMOVE ITEM ---------------- */
  const remove = async (foodId) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      const response = await userApi.post("/food/remove", { id: foodId });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error("Error occurred");
      }
    } catch {
      toast.error("Failed to remove item");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  /* ---------------- SEARCH FILTER ---------------- */
  const filteredItems = list.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-5 px-3 sm:px-6 py-4">
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Menu Items
        </h1>

        <button
          onClick={() => navigate("/add")}
          className="flex items-center justify-center gap-2 
                     bg-orange-500 hover:bg-orange-600 
                     text-white px-4 py-2 rounded-lg 
                     w-full sm:w-auto"
        >
          <PlusCircle size={18} />
          Add New Item
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-3 text-gray-400" size={16} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items..."
          className="w-full pl-9 pr-4 py-2.5 border rounded-lg 
                     focus:ring-2 focus:ring-orange-400 outline-none"
        />
      </div>

      {/* MOBILE CARDS */}
      <div className="grid gap-4 md:hidden">
        {filteredItems.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No items found</p>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-sm border p-4 flex gap-4"
            >
              <img
                src={`${import.meta.env.VITE_USER_API}/images/${item.image}`}
                alt={item.name}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />

              <div className="flex-1 space-y-1">
                <h2 className="font-semibold text-lg">{item.name}</h2>
                <p className="text-sm text-gray-500">
                  Category: {item.category}
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  ₹{item.price}
                </p>

                <div className="flex gap-5 pt-2">
                  <Eye
                    size={18}
                    className="text-blue-500 cursor-pointer"
                    onClick={() => setViewItem(item)}
                  />
                  <Edit
                    size={18}
                    className="text-orange-500 cursor-pointer"
                    onClick={() => navigate(`/add/${item._id}`)}
                  />
                  <Trash2
                    size={18}
                    className="text-red-500 cursor-pointer"
                    onClick={() => remove(item._id)}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Item</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No items found
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr
                  key={item._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={`${import.meta.env.VITE_USER_API}/images/${item.image}`}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <span className="font-medium">{item.name}</span>
                  </td>
                  <td className="px-4 py-3">{item.category}</td>
                  <td className="px-4 py-3 text-right">₹{item.price}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-5">
                      <Eye
                        size={18}
                        className="text-blue-500 cursor-pointer"
                        onClick={() => setViewItem(item)}
                      />
                      <Edit
                        size={18}
                        className="text-orange-500 cursor-pointer"
                        onClick={() => navigate(`/add/${item._id}`)}
                      />
                      <Trash2
                        size={18}
                        className="text-red-500 cursor-pointer"
                        onClick={() => remove(item._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW POPUP */}
      <AnimatePresence>
        {viewItem && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViewItem(null)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg w-full max-w-md relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setViewItem(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              >
                <X />
              </button>

              <img
                src={`${import.meta.env.VITE_USER_API}/images/${viewItem.image}`}
                className="w-full h-48 sm:h-56 object-cover rounded-t-xl"
              />

              <div className="p-5 space-y-3">
                <h2 className="text-xl font-bold">{viewItem.name}</h2>
                <p className="text-gray-600 text-sm">{viewItem.description}</p>

                <div className="flex justify-between text-sm text-gray-700">
                  <span>
                    <b>Category:</b> {viewItem.category}
                  </span>
                  <span>
                    <b>Price:</b> ₹{viewItem.price}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
