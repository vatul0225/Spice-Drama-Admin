import React, { useEffect, useState } from "react";
import { Edit, Trash2, Eye, PlusCircle, Search, X } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ❌ userApi hata diya
// import userApi from "../../services/userApi";

// ✅ adminApi use hoga (DELETE ke liye)
import adminApi from "../../services/adminApi";

export default function List() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [viewItem, setViewItem] = useState(null);

  const navigate = useNavigate();

  /* ---------------- FETCH LIST ---------------- */
  const fetchList = async () => {
    try {
      const response = await adminApi.get("/food/list");
      if (response.data.success) {
        setList(response.data.data);
      }
    } catch {
      toast.error("Server error");
    }
  };

  /* ---------------- REMOVE ITEM (FIXED) ---------------- */
  const remove = async (foodId) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      const response = await adminApi.post("/food/remove", { id: foodId });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(response.data.message || "Delete failed");
      }
    } catch (error) {
      console.error("DELETE ERROR:", error);
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
      <div className="space-y-4 sm:space-y-5 px-3 sm:px-4 lg:px-6 py-4 pb-24">
        {/* HEADER */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
              Menu Items
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Manage your food menu items
            </p>
          </div>

          <button
            onClick={() => navigate("/add")}
            className="cursor-pointer flex items-center justify-center gap-2 
                       bg-orange-500 hover:bg-orange-600 
                       text-white px-4 py-2 rounded-lg 
                       w-full sm:w-auto shadow-sm transition-all
                       text-sm font-medium"
          >
            <PlusCircle size={18} />
            Add New Item
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-orange-400 outline-none
                       bg-white shadow-sm text-sm"
          />
        </div>

        {/* MOBILE CARDS */}
        <div className="grid gap-3 sm:gap-4 lg:hidden">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-400 font-medium">No items found</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-sm border p-3 sm:p-4"
              >
                <div className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-base truncate">
                      {item.name}
                    </h2>
                    <p className="text-xs text-gray-500">
                      Category: {item.category}
                    </p>
                    <p className="font-bold text-orange-600 mt-1">
                      ₹{item.price}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t">
                  <button
                    onClick={() => setViewItem(item)}
                    className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-xs font-medium"
                  >
                    <Eye size={14} className="inline mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/add/${item._id}`)}
                    className="flex-1 bg-orange-50 text-orange-600 py-2 rounded-lg text-xs font-medium"
                  >
                    <Edit size={14} className="inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => remove(item._id)}
                    className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-xs font-medium"
                  >
                    <Trash2 size={14} className="inline mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden lg:block bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Item</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={item.image}
                      className="w-10 h-10 rounded object-cover"
                    />
                    {item.name}
                  </td>
                  <td className="px-4 py-3">{item.category}</td>
                  <td className="px-4 py-3 text-right font-semibold text-orange-600">
                    ₹{item.price}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <Eye
                        className="text-blue-600 cursor-pointer"
                        size={18}
                        onClick={() => setViewItem(item)}
                      />
                      <Edit
                        className="text-orange-600 cursor-pointer"
                        size={18}
                        onClick={() => navigate(`/add/${item._id}`)}
                      />
                      <Trash2
                        className="text-red-600 cursor-pointer"
                        size={18}
                        onClick={() => remove(item._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center text-xs text-gray-500">
          Showing {filteredItems.length} of {list.length} items
        </div>
      </div>

      {/* VIEW POPUP */}
      <AnimatePresence>
        {viewItem && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViewItem(null)}
          >
            <motion.div
              className="bg-white rounded-xl w-full max-w-md overflow-hidden"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setViewItem(null)}
                className="absolute top-3 right-3"
              >
                <X />
              </button>

              <img src={viewItem.image} className="w-full h-48 object-cover" />

              <div className="p-4 space-y-2">
                <h2 className="text-lg font-bold">{viewItem.name}</h2>
                <p className="text-sm text-gray-600">{viewItem.description}</p>
                <div className="flex justify-between font-semibold pt-2">
                  <span>{viewItem.category}</span>
                  <span className="text-orange-600">₹{viewItem.price}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
