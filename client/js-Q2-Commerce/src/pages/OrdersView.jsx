import { useState, useEffect } from "react";
import { fetchOrderHistory } from "../services/transactionService";
import styles from "../styles/OrdersView.module.css";
import { useNavigate } from "react-router-dom";

const OrdersView = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [sortOption, setSortOption] = useState("date");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [toastOrder, setToastOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderHistory().then((data) => {
      setOrders(data);
      setFilteredOrders(data);
    });
  }, []);

  const filterOrders = (type) => {
    setFilterType(type);
    if (type === "current") {
      setFilteredOrders(orders.filter((order) => order.status !== "Delivered"));
    } else if (type === "history") {
      setFilteredOrders(orders.filter((order) => order.status === "Delivered"));
    } else {
      setFilteredOrders(orders);
    }
  };

  const sortOrders = (option) => {
    setSortOption(option);
    const sorted = [...filteredOrders].sort((a, b) => {
      if (option === "date") return new Date(b.date) - new Date(a.date);
      if (option === "month") return new Date(b.date).getMonth() - new Date(a.date).getMonth();
      if (option === "year") return new Date(b.date).getFullYear() - new Date(a.date).getFullYear();
      return 0;
    });
    setFilteredOrders(sorted);
  };

  const toggleExpandOrder = (orderId) => {
    setExpandedOrderId((prevId) => (prevId === orderId ? null : orderId));
  };

  return (
    <div className={styles.ordersView}>
      <h1>Orders</h1>

      <div className={styles.filters}>
        <button onClick={() => filterOrders("current")} className={filterType === "current" ? styles.active : ""}>
          Current Orders
        </button>
        <button onClick={() => filterOrders("history")} className={filterType === "history" ? styles.active : ""}>
          Order History
        </button>
        <button onClick={() => filterOrders("all")} className={filterType === "all" ? styles.active : ""}>
          All Orders
        </button>
      </div>

      <div className={styles.sortOptions}>
        <label>Sort by:</label>
        <select value={sortOption} onChange={(e) => sortOrders(e.target.value)}>
          <option value="date">Date</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>

      <div className={styles.ordersList}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className={`${styles.order} ${expandedOrderId === order.id ? styles.expanded : ""}`}
              onClick={() => toggleExpandOrder(order.id)}
            >
              <h3>Order #{order.id}</h3>
              <p>Date: {order.date}</p>
              <p>Total: ${order.total.toFixed(2)}</p>
              <p className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>{order.status}</p>

              {expandedOrderId === order.id && (
                <>
                  <h4>Items:</h4>
                  <ul>
                    {order.items.map((item) => (
                      <li key={item.id}>{item.name} - ${item.price.toFixed(2)} (Qty: {item.quantity})</li>
                    ))}
                  </ul>
                </>
              )}

              <div className={styles.orderActions}>
                <button onClick={(e) => { e.stopPropagation(); setToastOrder(order); }}>View Order</button>
                <button onClick={(e) => { e.stopPropagation(); navigate(`/tracking?orderId=${order.id}`); }}>Track Order</button>
              </div>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>

      {/* Centered Toast Preview */}
      {toastOrder && (
        <div className={styles.toastPreview}>
          <div className={styles.toastContent}>
            <h3>Order #{toastOrder.id}</h3>
            <p>Date: {toastOrder.date}</p>
            <p>Total: ${toastOrder.total.toFixed(2)}</p>
            <p>Status: {toastOrder.status}</p>
            <h4>Items:</h4>
            <ul>
              {toastOrder.items.map((item) => (
                <li key={item.id}>{item.name} - ${item.price.toFixed(2)} (Qty: {item.quantity})</li>
              ))}
            </ul>
            <button onClick={() => setToastOrder(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersView;
