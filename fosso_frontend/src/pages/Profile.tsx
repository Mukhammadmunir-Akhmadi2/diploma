import { useState, useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import PersonalInfoForm from "../components/profile/PersonalInfoForm";
import SettingsSection from "../components/profile/SettingsSection";
import { getCurrentUserProfile } from "../api/User";
import { type UserProfileDTO } from "../types/user";
import { useToast } from "../hooks/useToast";
import { Spin } from "antd";
import AddressesSection from "../components/profile/AddressesSection";
import PaymentSection from "../components/profile/PaymentSection";
import OrdersSection from "../components/profile/OrdersSection";
import WishlistSection from "../components/profile/WishlistSection";
import type { ErrorResponse } from "../types/error";

const Profile = () => {
  const { t } = useLanguage();
  const [user, setUser] = useState<UserProfileDTO>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUserProfile();
        setUser(data);
      } catch (error) {
        const errorResponse = error as ErrorResponse;

        toast({
          title: t("error.fetchProduct"),
          description: t("error.tryAgain"),
          variant: "destructive",
        });
        console.error("Error fetching categories:", errorResponse);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const renderSection = () => {
    const path = location.pathname;

    if (!user) {
      return <Navigate to="/login" />;
    }

    if (path.includes("/profile/addresses")) {
      return <AddressesSection />;
    } else if (path.includes("/profile/payment")) {
      return <PaymentSection />;
    } else if (path.includes("/profile/orders")) {
      return <OrdersSection userId={user?.userId} />;
    } else if (path.includes("/profile/wishlist")) {
      return <WishlistSection />;
    } else if (path.includes("/profile/settings")) {
      return <SettingsSection />;
    } else {
      return user && <PersonalInfoForm user={user} setUser={setUser} />;
    }
  };

  if (isLoading) {
    // Show Ant Design's Spin component while loading
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin
          size="large"
          tip={t("profile.loading", { defaultValue: "Loading..." })}
        />
      </div>
    );
  }
  return (
    <>
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold mb-8">{t("profile.myProfile")}</h1>
        <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
          {/* Sidebar */}
          {user && <ProfileSidebar user={user} />}

          {/* Main Content */}
          <div className="w-full md:w-3/4">{renderSection()}</div>
        </div>
      </div>
    </>
  );
};

export default Profile;
