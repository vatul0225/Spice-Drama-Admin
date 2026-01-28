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
    <div className="space-y-4 sm:space-y-5 px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
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
          className="flex items-center justify-center gap-2 
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
                     focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none
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
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 
                         hover:shadow-md transition-all"
            >
              <div className="flex gap-3">
                <img
                  src={`${import.meta.env.VITE_USER_API}/images/${item.image}`}
                  alt={item.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-base sm:text-lg text-gray-800 truncate">
                    {item.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    Category:{" "}
                    <span className="font-medium">{item.category}</span>
                  </p>
                  <p className="text-sm sm:text-base font-bold text-orange-600 mt-1">
                    ₹{item.price}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3 pt-3 border-t">
                <button
                  onClick={() => setViewItem(item)}
                  className="flex-1 flex items-center justify-center gap-1.5 
                             bg-blue-50 text-blue-600 hover:bg-blue-100
                             py-2 rounded-lg transition-all text-xs sm:text-sm font-medium"
                >
                  <Eye size={16} />
                  View
                </button>
                <button
                  onClick={() => navigate(`/add/${item._id}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 
                             bg-orange-50 text-orange-600 hover:bg-orange-100
                             py-2 rounded-lg transition-all text-xs sm:text-sm font-medium"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => remove(item._id)}
                  className="flex-1 flex items-center justify-center gap-1.5 
                             bg-red-50 text-red-600 hover:bg-red-100
                             py-2 rounded-lg transition-all text-xs sm:text-sm font-medium"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Item</th>
                <th className="px-4 py-3 text-left font-semibold">Category</th>
                <th className="px-4 py-3 text-right font-semibold">Price</th>
                <th className="px-4 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-12 text-gray-400 font-medium"
                  >
                    No items found
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item._id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={`${import.meta.env.VITE_USER_API}/images/${item.image}`}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <span className="font-medium text-gray-800">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{item.category}</td>
                    <td className="px-4 py-3 text-right font-semibold text-orange-600">
                      ₹{item.price}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setViewItem(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => navigate(`/add/${item._id}`)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                          title="Edit Item"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => remove(item._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Items Count */}
      {filteredItems.length > 0 && (
        <div className="text-center text-xs sm:text-sm text-gray-500">
          Showing {filteredItems.length} of {list.length} item
          {list.length !== 1 ? "s" : ""}
        </div>
      )}

      {/* VIEW POPUP */}
      <AnimatePresence>
        {viewItem && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-3 sm:px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViewItem(null)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setViewItem(null)}
                className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm
                           text-gray-600 hover:text-red-600 hover:bg-white
                           w-8 h-8 rounded-full flex items-center justify-center
                           shadow-lg transition-all"
              >
                <X size={18} />
              </button>

              {/* Image */}
              <div className="relative">
                <img
                  src={`${import.meta.env.VITE_USER_API}/images/${viewItem.image}`}
                  alt={viewItem.name}
                  className="w-full h-48 sm:h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">
                    {viewItem.name}
                  </h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Description
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {viewItem.description || "No description available"}
                  </p>
                </div>

                <div className="flex gap-4 pt-3 border-t">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Category
                    </p>
                    <p className="text-gray-800 font-medium">
                      {viewItem.category}
                    </p>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Price
                    </p>
                    <p className="text-xl font-bold text-orange-600">
                      ₹{viewItem.price}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
