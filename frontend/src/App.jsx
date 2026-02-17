import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider, useCart } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";   // ✅ ADD THIS
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FreeDeliveryBanner from "./components/FreeDeliveryBanner";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CartPage from "./pages/Cart";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders"; 

function AppContent() {
  const { cart } = useCart();

  const cartTotal = cart.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  return (
    <>
      <Navbar />

      <div className="pt-20 px-8 min-h-[calc(100vh-200px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/orders" element={<MyOrders />} />
        </Routes>
      </div>

      {/* Banner fixed above footer */}
      <div className="free-delivery-banner-wrapper">
        <FreeDeliveryBanner cartTotal={cartTotal} />
      </div>

      <Footer />
    </>
  );
}

function App() {
  return (
    <OrderProvider>     {/* ✅ WRAP HERE */}
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </OrderProvider>
  );
}

export default App;
