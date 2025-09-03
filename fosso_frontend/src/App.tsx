import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./providers/LanguageProvider";
import { lazy, Suspense } from "react";
import { Spin } from "antd";
import PersonalInfoForm from "./components/profile/PersonalInfoForm";
import AddressesSection from "./components/profile/AddressesSection";
import PaymentSection from "./components/profile/PaymentSection";
import OrdersSection from "./components/profile/OrdersSection";
import WishlistSection from "./components/profile/WishlistSection";
import SettingsSection from "./components/profile/SettingsSection";
import ProtectedLayout from "./layout/ProtectedLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Lazy imports
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Terms = lazy(() => import("./pages/Terms"));
const Profile = lazy(() => import("./pages/Profile"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const ProductDetail = lazy(() => import("./components/ProductDetail"));
const CartPage = lazy(() => import("./components/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const MerchantDashboard = lazy(() => import("./pages/MerchantDashboard"));
const CreateProduct = lazy(() => import("./pages/CreateProduct"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const BrandListingPage = lazy(() => import("./pages/BrandListingPage"));
const OrderDetailPage = lazy(
  () => import("./components/profile/OrderDetailPage")
);
const MerchantOrderedProducts = lazy(
  () => import("./pages/MerchantOrderedProducts")
);
const OrderConfirmationPage = lazy(
  () => import("./pages/OrderConfirmationPage")
);

// Admin Pages
const UsersManagement = lazy(() => import("./pages/admin/UsersManagement"));
const UserDetailsPage = lazy(() => import("./pages/admin/UserDetailsPage"));
const CategoriesManagement = lazy(
  () => import("./pages/admin/CategoriesManagement")
);
const BrandsManagement = lazy(() => import("./pages/admin/BrandsManagement"));
const ProductsPage = lazy(() => import("./pages/admin/ProductsPage"));

const Layout = lazy(() => import("./layout/Layout"));
const NewInPage = lazy(() => import("./pages/NewInPage"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <Suspense fallback={<Spin />}>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route
                    path="womenswear"
                    element={<Index gender="FEMALE" />}
                  />
                  <Route path="menswear" element={<Index gender="MALE" />} />

                  <Route path="wishlist" element={<Wishlist />} />
                  <Route path="cart" element={<CartPage />} />

                  <Route path="category" element={<CategoryPage />} />
                  <Route
                    path="women/category"
                    element={<CategoryPage gender="FEMALE" />}
                  />
                  <Route
                    path="men/category"
                    element={<CategoryPage gender="MALE" />}
                  />
                  <Route
                    path="category/:categoryId"
                    element={<CategoryPage />}
                  />
                  <Route path="brand/:brandId" element={<CategoryPage />} />

                  <Route
                    path="women/brand/:brandId"
                    element={<CategoryPage gender="FEMALE" />}
                  />

                  <Route
                    path="men/brand/:brandId"
                    element={<CategoryPage gender="MALE" />}
                  />

                  <Route
                    path="women/category/:categoryId"
                    element={<CategoryPage gender="FEMALE" />}
                  />
                  <Route
                    path="men/category/:categoryId"
                    element={<CategoryPage gender="MALE" />}
                  />

                  <Route
                    path="women/trending"
                    element={<CategoryPage isPopular={true} gender="FEMALE" />}
                  />
                  <Route
                    path="men/trending"
                    element={<CategoryPage isPopular={true} gender="MALE" />}
                  />
                  <Route
                    path="trending"
                    element={<CategoryPage isPopular={true} />}
                  />

                  <Route path="new-in" element={<NewInPage />} />

                  <Route
                    path="men/search/:keyword"
                    element={<CategoryPage gender="MALE" />}
                  />

                  <Route
                    path="women/search/:keyword"
                    element={<CategoryPage gender="FEMALE" />}
                  />

                  <Route path="search/:keyword" element={<CategoryPage />} />

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
                      <Route
                        path="users/:userId"
                        element={<UserDetailsPage />}
                      />
                      <Route
                        path="categories"
                        element={<CategoriesManagement />}
                      />
                      <Route path="brands" element={<BrandsManagement />} />
                      <Route path="products" element={<ProductsPage />} />
                      <Route
                        path="products/edit/:id"
                        element={<CreateProduct />}
                      />
                    </Route>
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Route>

                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="terms" element={<Terms />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </Suspense>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
