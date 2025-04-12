import Navbar from "./components/Navbar";
import ThemeToggle from "./components/ThemeToggle";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductDetails from "./pages/ProductDetails";
import Home from "./pages/Home";

import { AuthProvider } from "./contexts/AuthContext"; // ✅ Integrated authentication context
import { CartProvider } from "./contexts/CartContext";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import NotificationBell from "./components/NotificationBell";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderTracking from "./pages/OrderTracking";
import OrderHistory from "./pages/OrderHistory";
import OrderDetails from "./pages/OrderDetails";
import OrdersView from "./pages/OrdersView";

function App() {
  return (
    <AuthProvider> {/* ✅ Wraps app with authentication context */}
      <CartProvider>
        <Router>
          <Navbar />
          <ThemeToggle />
          <NotificationBell orderId="1002" /> {/* Example order ID */}
          <Routes>          
            <Route path="/" element={<Home />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />  {/* ✅ Cart route added */}
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/confirmation" element={<OrderConfirmation />} />
            <Route path="/tracking" element={<OrderTracking />} />
            <Route path="/order-history" element={<OrderHistory />} />          
            <Route path="/order-details" element={<OrderDetails />} />
            <Route path="/orders" element={<OrdersView />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
