import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import userApi from "../../services/userApi";

export default function AddItems() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [oldImage, setOldImage] = useState("");

  const [data, setData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
  });

  /* ---------------- FETCH DATA (EDIT MODE) ---------------- */
  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        try {
          const res = await userApi.get(`/food/single/${id}`);
          if (res.data.success) {
            setData({
              name: res.data.data.name || "",
              description: res.data.data.description || "",
              category: res.data.data.category || "",
              price: res.data.data.price || "",
              quantity: res.data.data.quantity || "",
            });
            setOldImage(res.data.data.image);
          }
        } catch (err) {
          toast.error("Failed to load item");
        }
      };
      fetchItem();
    }
  }, [id]);

  /* ---------------- INPUT HANDLER ---------------- */
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------------- SUBMIT HANDLER ---------------- */
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // BASIC VALIDATION
    if (!data.name || !data.category || !data.price || data.quantity === "") {
      toast.error("Please fill all required fields");
      return;
    }

    if (Number(data.quantity) < 0) {
      toast.error("Quantity cannot be negative");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", data.name.trim());
      formData.append("description", data.description.trim());
      formData.append("category", data.category);
      formData.append("price", Number(data.price));
      formData.append("quantity", Number(data.quantity));
      formData.append("isOutOfStock", Number(data.quantity) === 0);

      if (image) {
        formData.append("image", image);
      }

      let response;

      if (id) {
        response = await userApi.put(`/food/update/${id}`, formData);
      } else {
        response = await userApi.post("/food/add", formData);
      }

      if (response.data.success) {
        toast.success(
          id ? "Item updated successfully" : "Item added successfully",
        );
        navigate("/list");
      } else {
        toast.error(response.data.message || "Operation failed");
      }
    } catch (error) {
      console.error("ADD ITEM ERROR", error.response?.data || error);
      toast.error(error.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-3 sm:px-6 py-6">
      <form onSubmit={onSubmitHandler}>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* HEADER */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              {id ? "Edit Item" : "Add New Item"}
            </h1>
            <p className="text-gray-600">
              {id
                ? "Update your menu item"
                : "Add a new menu item to your restaurant"}
            </p>
          </div>

          {/* CARD */}
          <div className="bg-white rounded-xl shadow border">
            <div className="p-4 sm:p-6 space-y-6">
              {/* IMAGE */}
              <label className="block font-semibold text-gray-700">
                Product Image
              </label>

              <label className="h-40 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer">
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : oldImage ? (
                  <img
                    src={oldImage}
                    alt="old"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <Upload className="mx-auto mb-2" />
                    Upload Image
                  </div>
                )}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>

              {/* NAME */}
              <input
                name="name"
                placeholder="Product Name"
                value={data.name}
                onChange={onChangeHandler}
                className="w-full px-4 py-3 border rounded-lg"
                required
              />

              {/* DESCRIPTION */}
              <textarea
                name="description"
                placeholder="Description"
                value={data.description}
                onChange={onChangeHandler}
                rows="4"
                className="w-full px-4 py-3 border rounded-lg"
              />

              {/* CATEGORY */}
              <select
                name="category"
                value={data.category}
                onChange={onChangeHandler}
                className="w-full px-4 py-3 border rounded-lg"
                required
              >
                <option value="">Select Category</option>
                <option>Pizza</option>
                <option>Burger</option>
                <option>Rolls</option>
                <option>Paneer</option>
                <option>Veg Curries</option>
                <option>Daal</option>
                <option>Rice</option>
                <option>Roti</option>
                <option>Chicken</option>
                <option>Egg</option>
                <option>Fish</option>
                <option>Noodles</option>
                <option>Maggie</option>
                <option>Snacks</option>
                <option>Desserts</option>
                <option>Beverages</option>
              </select>

              {/* PRICE + QUANTITY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="price"
                  type="number"
                  placeholder="Price"
                  value={data.price}
                  onChange={onChangeHandler}
                  className="px-4 py-3 border rounded-lg"
                  required
                />

                <input
                  name="quantity"
                  type="number"
                  placeholder="Available Quantity"
                  value={data.quantity}
                  onChange={onChangeHandler}
                  className="px-4 py-3 border rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="p-4">
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
              >
                {id ? "Update Item" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
