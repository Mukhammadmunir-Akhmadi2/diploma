import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import PersonalInfoForm from "./pages/profile/PersonalInfoForm";
import AddressesSection from "./pages/profile/AddressesSection";
import PaymentSection from "./pages/profile/PaymentSection";
import OrdersSection from "./pages/profile/OrdersSection";
import WishlistSection from "./pages/profile/WishlistSection";
import SettingsSection from "./pages/profile/SettingsSection";
import ProtectedLayout from "./layout/ProtectedLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { useAppSelector } from "./store/hooks";
import UsersManagement from "./pages/admin/UsersManagement";
import UserDetailsPage from "./pages/admin/UserDetailsPage";
import CategoriesManagement from "./pages/admin/CategoriesManagement";
import BrandsManagement from "./pages/admin/BrandsManagement";
import ProductsPage from "./pages/admin/ProductsPage";
import Layout from "./layout/Layout";
import Index from "./pages/Index";
import Wishlist from "./pages/Wishlist";
import CartPage from "./pages/CartPage";
import ProductFilterPage from "./pages/ProductFilterPage";
import ProductDetail from "./pages/productDetails/ProductDetail";
import BrandListingPage from "./pages/BrandListingPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import CreateProduct from "./pages/productCreate/CreateProduct";
import Login from "./pages/Login";
import MerchantDashboard from "./pages/MerchantDashboard";
import MerchantOrderedProducts from "./pages/MerchantOrderedProducts";
import NewInPage from "./pages/NewInPage";
import NotFound from "./pages/NotFound";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import Profile from "./pages/profile/Profile";
import Signup from "./pages/Signup";
import Terms from "./pages/Terms";

const App = () => {
  const theme = useAppSelector((state) => state.theme.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="womenswear" element={<Index gender="FEMALE" />} />
            <Route path="menswear" element={<Index gender="MALE" />} />

            <Route path="wishlist" element={<Wishlist />} />
            <Route path="cart" element={<CartPage />} />

            <Route path="category" element={<ProductFilterPage />} />
            <Route
              path="women/category"
              element={<ProductFilterPage gender="FEMALE" />}
            />
            <Route
              path="men/category"
              element={<ProductFilterPage gender="MALE" />}
            />
            <Route
              path="category/:categoryId"
              element={<ProductFilterPage />}
            />
            <Route path="brand/:brandId" element={<ProductFilterPage />} />

            <Route
              path="women/brand/:brandId"
              element={<ProductFilterPage gender="FEMALE" />}
            />

            <Route
              path="men/brand/:brandId"
              element={<ProductFilterPage gender="MALE" />}
            />

            <Route
              path="women/category/:categoryId"
              element={<ProductFilterPage gender="FEMALE" />}
            />
            <Route
              path="men/category/:categoryId"
              element={<ProductFilterPage gender="MALE" />}
            />

            <Route
              path="women/trending"
              element={<ProductFilterPage isPopular={true} gender="FEMALE" />}
            />
            <Route
              path="men/trending"
              element={<ProductFilterPage isPopular={true} gender="MALE" />}
            />
            <Route
              path="trending"
              element={<ProductFilterPage isPopular={true} />}
            />

            <Route path="new-in" element={<NewInPage />} />

            <Route
              path="men/search/:keyword"
              element={<ProductFilterPage gender="MALE" />}
            />

            <Route
              path="women/search/:keyword"
              element={<ProductFilterPage gender="FEMALE" />}
            />

            <Route path="search/:keyword" element={<ProductFilterPage />} />

            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="brands" element={<BrandListingPage />} />

            {/* Profile Routes */}
            <Route element={<ProtectedLayout />}>
              <Route path="profile" element={<Profile />}>
                <Route index element={<PersonalInfoForm />} />
                <Route path="addresses" element={<AddressesSection />} />
                <Route path="payment" element={<PaymentSection />} />
                <Route path="orders" element={<OrdersSection />} />
                <Route path="wishlist" element={<WishlistSection />} />
                <Route path="settings" element={<SettingsSection />} />
              </Route>
              <Route path="order/:id" element={<OrderDetailPage />} />
              <Route path="logout" element={<Login />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route
                path="order-confirmation/:slug"
                element={<OrderConfirmationPage />}
              />

              {/* Merchant Routes */}
              <Route
                path="merchant/dashboard"
                element={<MerchantDashboard />}
              />
              <Route
                path="merchant/create-product"
                element={<CreateProduct />}
              />
              <Route
                path="merchant/edit-product/:id"
                element={<CreateProduct />}
              />
              <Route
                path="merchant/ordered-products"
                element={<MerchantOrderedProducts />}
              />

              {/* Admin Routes */}
              <Route path="admin" element={<AdminDashboard />}>
                <Route index path="users" element={<UsersManagement />} />
                <Route path="users/:userId" element={<UserDetailsPage />} />
                <Route path="categories" element={<CategoriesManagement />} />
                <Route path="brands" element={<BrandsManagement />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/edit/:id" element={<CreateProduct />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="terms" element={<Terms />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
