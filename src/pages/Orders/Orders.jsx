import React, { useState, useEffect } from "react";
import { Clock, MapPin, Phone, User, CreditCard } from "lucide-react";
import { toast } from "react-toastify";
import userApi from "../../services/userApi";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  /* ---------------- FETCH ALL ORDERS ---------------- */
  const fetchAllOrders = async () => {
    try {
      const response = await userApi.get("/order/list");
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      toast.error("Server error while fetching orders");
    }
  };

  /* ---------------- UPDATE ORDER STATUS ---------------- */
  const statusHandler = async (event, orderId) => {
    try {
      const response = await userApi.post("/order/status", {
        orderId,
        status: event.target.value,
      });

      if (response.data.success) {
        fetchAllOrders();
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Server error while updating status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="space-y-6 px-3 sm:px-6 py-4">
      {/* PAGE TITLE */}
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
        Customer Orders
      </h1>

      {/* EMPTY STATE */}
      {orders.length === 0 && (
        <div className="bg-white p-8 rounded-xl shadow text-center text-gray-500">
          No orders found
        </div>
      )}

      {/* ORDERS */}
      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white rounded-xl shadow border border-gray-100 p-4 sm:p-6 space-y-5"
        >
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="font-semibold text-base sm:text-lg text-gray-800 break-all">
                Order ID: {order._id}
              </h2>

              {order.date && (
                <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {new Date(order.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>

                  <span>
                    {new Date(order.date).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* STATUS */}
            <select
              value={order.status}
              onChange={(e) => statusHandler(e, order._id)}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg border 
                          text-sm font-medium cursor-pointer outline-none
                ${
                  order.status === "pending" &&
                  "bg-yellow-50 text-yellow-700 border-yellow-300"
                }
                ${
                  order.status === "preparing" &&
                  "bg-blue-50 text-blue-700 border-blue-300"
                }
                ${
                  order.status === "out_for_delivery" &&
                  "bg-purple-50 text-purple-700 border-purple-300"
                }
                ${
                  order.status === "delivered" &&
                  "bg-green-50 text-green-700 border-green-300"
                }
                ${
                  order.status === "cancelled" &&
                  "bg-red-50 text-red-700 border-red-300"
                }`}
            >
              <option value="pending">Food Processing</option>
              <option value="preparing">Preparing</option>
              <option value="out_for_delivery">Out for delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* CUSTOMER INFO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <p className="font-medium">
                  {order.address?.first_name} {order.address?.last_name}
                </p>
                <p className="text-gray-500 flex items-center gap-1">
                  <Phone size={14} />
                  {order.address?.phone}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-orange-500 mt-0.5" />
              <p className="text-gray-600">
                {order.address?.street}, {order.address?.city},{" "}
                {order.address?.state}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-orange-500 mt-0.5" />
              <p className="text-gray-600">
                {order.paymentMethod || "Cash On Delivery"}
              </p>
            </div>
          </div>

          {/* ITEMS TABLE */}
          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full text-sm min-w-[420px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2">Item</th>
                  <th className="text-center px-4 py-2">Qty</th>
                  <th className="text-right px-4 py-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right px-4 py-2">
                      ₹{item.price * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* BILL */}
          <div className="border-t pt-4 space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Item Total</span>
              <span>
                ₹
                {order.itemTotal ??
                  order.items.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0,
                  )}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span>₹{order.deliveryCharge ?? 40}</span>
            </div>

            <div
              className="flex justify-between font-semibold text-base sm:text-lg 
                            text-orange-600 border-t pt-2"
            >
              <span>Grand Total</span>
              <span>₹{order.amount}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
