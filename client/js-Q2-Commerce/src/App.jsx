import Navbar from "./components/Navbar";
import ThemeToggle from "./components/ThemeToggle";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductDetails from "./pages/ProductDetails";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage"; // ✅ Import AuthPage

import { AuthProvider } from "./contexts/AuthContext"; // 🔐 Handles authentication and user sessions
import { CartProvider } from "./contexts/CartContext"; // 🛒 Manages shopping cart state
import { TransactionProvider } from "./contexts/TransactionContext"; // 💳 Handles transaction history
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
    <AuthProvider> {/* 🔐 Wraps app with authentication */}
      <CartProvider> {/* 🛒 Cart comes first */}
        <TransactionProvider> {/* 💳 Transactions follow */}
          <Router>
            <Navbar />            
            <NotificationBell orderId="1002" /> {/* Example order ID */}
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/product/:productId" element={<ProductDetails />} />
              <Route path="/auth" element={<AuthPage />} /> {/* Unified Sign-In/Sign-Up Page */}
              
              {/* Protected Routes */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/confirmation" element={<OrderConfirmation />} />
              <Route path="/tracking" element={<OrderTracking />} />
              <Route path="/order-history" element={<OrderHistory />} />
              <Route path="/order-details" element={<OrderDetails />} />
              <Route path="/orders" element={<OrdersView />} />
            </Routes>
          </Router>
        </TransactionProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;