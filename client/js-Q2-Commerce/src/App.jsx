import Navbar from "./components/Navbar";
import ThemeToggle from "./components/ThemeToggle";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductDetails from "./pages/ProductDetails";
import Home from "./pages/Home";

import { CartProvider } from "./contexts/CartContext";
import Cart from "./pages/Cart";

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <ThemeToggle />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />  {/* ✅ Cart route added */}
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;







// import { useState } from "react";
// import { ThemeProvider } from "./contexts/ThemeContext";
// import ThemeToggle from "./components/ThemeToggle";
// import Navbar from "./components/Navbar";  // ✅ Import Navbar

// function App() {
//   return (
//     <ThemeProvider>
//       <Navbar />   {/* ✅ Navbar should come before ThemeToggle for better placement */}
//       <ThemeToggle />
//       {/* Other components */}
//     </ThemeProvider>
//   );
// }

// export default App;

