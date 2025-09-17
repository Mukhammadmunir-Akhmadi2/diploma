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
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import { useAppSelector } from "./store/hooks";
import UsersManagement from "./pages/admin/UsersManagement";
import UserDetailsPage from "./pages/admin/UserDetailsPage";
import CategoriesManagement from "./pages/admin/CategoriesManagement";
import BrandsManagement from "./pages/admin/BrandsManagement";
import ProductsPage from "./pages/admin/ProductsPage";
import Layout from "./layout/Layout";
import Index from "./pages/Index";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/cart/CartPage";
import ProductFilterPage from "./pages/ProductFilterPage";
import ProductDetailPage from "./pages/productDetails/ProductDetailPage";
import BrandListingPage from "./pages/BrandListingPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import CreateProductPage from "./pages/productCreate/CreateProductPage";
import LoginPage from "./pages/LoginPage";
import MerchantDashboardPage from "./pages/MerchantDashboardPage";
import MerchantOrderedProductsPage from "./pages/MerchantOrderedProductsPage";
import NewInPage from "./pages/NewInPage";
import NotFoundPage from "./pages/NotFoundPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderDetailPage from "./pages/orderDetail/OrderDetailPage";
import ProfilePage from "./pages/profile/ProfilePage";
import SignupPage from "./pages/SignupPage";
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

            <Route path="wishlist" element={<WishlistPage />} />
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

            <Route path="product/:id" element={<ProductDetailPage />} />
            <Route path="brands" element={<BrandListingPage />} />

            {/* Profile Routes */}
            <Route element={<ProtectedLayout />}>
              <Route path="profile" element={<ProfilePage />}>
                <Route index element={<PersonalInfoForm />} />
                <Route path="addresses" element={<AddressesSection />} />
                <Route path="payment" element={<PaymentSection />} />
                <Route path="orders" element={<OrdersSection />} />
                <Route path="wishlist" element={<WishlistSection />} />
                <Route path="settings" element={<SettingsSection />} />
              </Route>
              <Route path="order/:id" element={<OrderDetailPage />} />
              <Route path="logout" element={<LoginPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route
                path="order-confirmation/:slug"
                element={<OrderConfirmationPage />}
              />

              {/* Merchant Routes */}
              <Route
                path="merchant/dashboard"
                element={<MerchantDashboardPage />}
              />
              <Route
                path="merchant/create-product"
                element={<CreateProductPage />}
              />
              <Route
                path="merchant/edit-product/:id"
                element={<CreateProductPage />}
              />
              <Route
                path="merchant/ordered-products"
                element={<MerchantOrderedProductsPage />}
              />

              {/* Admin Routes */}
              <Route path="admin" element={<AdminDashboardPage />}>
                <Route index path="users" element={<UsersManagement />} />
                <Route path="users/:userId" element={<UserDetailsPage />} />
                <Route path="categories" element={<CategoriesManagement />} />
                <Route path="brands" element={<BrandsManagement />} />
                <Route path="products" element={<ProductsPage />} />
                <Route
                  path="products/edit/:id"
                  element={<CreateProductPage />}
                />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="terms" element={<Terms />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
