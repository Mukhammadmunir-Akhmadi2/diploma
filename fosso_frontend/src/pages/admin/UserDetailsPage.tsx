import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { useToast } from "../../hooks/use-toast";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { ScrollArea } from "../../components/ui/scroll-area";
import {
  User,
  Edit,
  Trash,
  ShieldCheck,
  ShieldX,
  Package,
  Star,
  MapPin,
  LogOut,
} from "lucide-react";
import type { AdminUserDetailDTO } from "../../types/admin/adminUser";
import type { UserUpdateDTO } from "../../types/user";
import {
  getUserById,
  blockUser,
  unblockUser,
  updateUser,
  restoreUser,
  deleteUser,
} from "../../api/admin/AdminUser";
import type { OrderBriefDTO } from "../../types/order";
import { getOrdersByCustomer } from "../../api/Order";
import { getLogsByUserId } from "../../api/Log";
import type { ActionLog } from "../../types/log";
import { getReviewsByCustomerId } from "../../api/Review";
import type { ReviewDTO } from "../../types/review";
import { Spin } from "antd";
import { getProductsByMerchant } from "../../api/admin/AdminProduct";
import type { AdminProductBriefDTO } from "../../types/admin/adminProduct";
import { deleteImageByOwnerId } from "../../api/Image";
import type { ImageDTO } from "../../types/image";

const UserDetailsPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { userId } = useParams();
  const navigate = useNavigate();

  // State for user data and editing mode
  const [userData, setUserData] = useState<{
    user: AdminUserDetailDTO | null;
    orders: OrderBriefDTO[] | null;
    logs: ActionLog[] | null;
    reviews: ReviewDTO[] | null;
    products?: AdminProductBriefDTO[] | null;
  }>({
    user: null,
    orders: null,
    logs: null,
    reviews: null,
    products: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<AdminUserDetailDTO>();
  const [selectedTab, setSelectedTab] = useState("profile");
  const [banDuration, setBanDuration] = useState("7");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch user details, orders, logs, and reviews
        const [user, orders, logs, reviews] = await Promise.all([
          getUserById(userId!).catch((error) => {
            console.error("Error fetching user details:", error);
            return null; // Return null if user details fail
          }),
          getOrdersByCustomer(userId!, 1, 100).catch((error) => {
            console.error("Error fetching orders:", error);
            return { products: [] }; // Return empty orders if it fails
          }),
          getLogsByUserId(userId!).catch((error) => {
            console.error("Error fetching logs:", error);
            return []; // Return empty logs if it fails
          }),
          getReviewsByCustomerId(userId!).catch((error) => {
            console.error("Error fetching reviews:", error);
            return []; // Return empty reviews if it fails
          }),
        ]);

        let products = null;

        // Fetch products only if the user has the MERCHANT role
        if (user && user.roles.includes("MERCHANT")) {
          products = await getProductsByMerchant(userId!, 1, 100)
            .then((response) => response.products)
            .catch((error) => {
              console.error("Error fetching products:", error);
              return []; // Return empty products if it fails
            });
        }

        // Update state with fetched data
        setUserData({
          user,
          orders: orders?.products || [],
          logs: logs || [],
          reviews: reviews || [],
          products,
        });
      } catch (error: any) {
        console.error("Unexpected error fetching user data:", error);
        toast({
          title: t("admin.errorFetchingData"),
          description: error.message || t("admin.somethingWentWrong"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setEditedUser((prev) => {
      if (!prev) return undefined; // Handle the case where prev is undefined

      return {
        ...prev,
        [name]: value,
      } as AdminUserDetailDTO; // Explicitly cast to AdminUserDetailDTO
    });
  };

  const handleSaveChanges = async () => {
    try {
      if (!editedUser || !userId) return;

      // Send updated data to API
      await updateUser(userId, editedUser as UserUpdateDTO);

      // Update state with the new user data
      setUserData((prev) => ({
        ...prev,
        user: { ...prev.user, ...editedUser },
      }));

      setIsEditing(false);

      toast({
        title: t("admin.userUpdated"),
        description: t("admin.userUpdatedDesc"),
      });
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast({
        title: t("admin.errorUpdatingUser"),
        description: error.message || t("admin.somethingWentWrong"),
        variant: "destructive",
      });
    }
  };

  const handleBanUser = async () => {
    try {
      if (!userId) return;

      const days = parseInt(banDuration);
      await blockUser(userId, days);

      // Update user status in state
      setUserData((prev) => ({
        ...prev,
        user: prev.user
          ? {
              ...prev.user,
              enabled: false,
              banExpirationTime:
                days > 0
                  ? new Date(
                      Date.now() + days * 24 * 60 * 60 * 1000
                    ).toISOString()
                  : null,
            }
          : null,
      }));

      toast({
        title: t("admin.userBanned"),
        description:
          days > 0
            ? t("admin.userBannedForDays", { days })
            : t("admin.userBannedPermanently"),
      });
    } catch (error: any) {
      console.error("Error banning user:", error);
      toast({
        title: t("admin.errorBanningUser"),
        description: error.message || t("admin.somethingWentWrong"),
        variant: "destructive",
      });
    }
  };

  const handleUnbanUser = async () => {
    try {
      if (!userId) return;

      await unblockUser(userId);

      setUserData((prev) => ({
        ...prev,
        user: prev.user
          ? {
              ...prev.user,
              enabled: true,
              banExpirationTime: null,
            }
          : null,
      }));

      toast({
        title: t("admin.userUnbanned"),
        description: t("admin.userUnbannedDesc"),
      });
    } catch (error: any) {
      console.error("Error unbanning user:", error);
      toast({
        title: t("admin.errorUnbanningUser"),
        description: error.message || t("admin.somethingWentWrong"),
        variant: "destructive",
      });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      setUserData((prev) => ({
        ...prev,
        reviews: prev.reviews
          ? prev.reviews?.filter((review) => review.reviewId !== reviewId)
          : null,
      }));

      toast({
        title: t("admin.reviewDeleted"),
        description: t("admin.reviewDeletedDesc"),
      });
    } catch (error: any) {
      console.error("Error deleting review:", error);
      toast({
        title: t("admin.errorDeletingReview"),
        description: error.message || t("admin.somethingWentWrong"),
        variant: "destructive",
      });
    }
  };

  const handleDeleteAvatar = async (userId: string ,image: ImageDTO) => {
    try {
      if (!userId) return;

      await deleteImageByOwnerId(userId, image.imageId, "USER_AVATAR");

      setUserData((prev) => ({
        ...prev,
        user: prev.user
          ? {
              ...prev.user,
              image: null,
            }
          : null,
      }));

      toast({
        title: t("admin.avatarDeleted"),
        description: t("admin.avatarDeletedDesc"),
      });
    } catch (error: any) {
      console.error("Error deleting avatar:", error);
      toast({
        title: t("admin.errorDeletingAvatar"),
        description: error.message || t("admin.somethingWentWrong"),
        variant: "destructive",
      });
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleDeleteUser = async () => {
    try {
      if (!userId) return;

      await deleteUser(userId);

      // Update user state to reflect deletion
      setUserData((prev) => ({
        ...prev,
        user: prev.user
          ? {
              ...prev.user,
              isDeleted: true,
            }
          : null,
      }));

      toast({
        title: t("admin.accountDeleted"),
        description: t("admin.accountDeletedDesc"),
      });
    } catch (error: any) {
      console.error("Error deleting user account:", error);
      toast({
        title: t("admin.errorDeletingAccount"),
        description: error.message || t("admin.somethingWentWrong"),
        variant: "destructive",
      });
    }
  };

  const handleRestoreUser = async () => {
    try {
      if (!userId) return;

      await restoreUser(userId);

      // Update user state to reflect restoration
      setUserData((prev) => ({
        ...prev,
        user: prev.user
          ? {
              ...prev.user,
              isDeleted: false,
            }
          : null,
      }));

      toast({
        title: t("admin.accountRestored"),
        description: t("admin.accountRestoredDesc"),
      });
    } catch (error: any) {
      console.error("Error restoring user account:", error);
      toast({
        title: t("admin.errorRestoringAccount"),
        description: error.message || t("admin.somethingWentWrong"),
        variant: "destructive",
      });
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t("admin.userDetails")}</h1>
          <Button variant="outline" onClick={() => navigate("/admin/users")}>
            <span className="sr-only md:not-sr-only md:ml-2">
              {t("common.back")}
            </span>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* Admin Sidebar */}
          <AdminSidebar />

          {/* Main Content */}
          <div className="w-full md:w-3/4 space-y-6">
            {/* User Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                  <div className="flex-shrink-0 w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    {userData.user?.image ? (
                      <img
                        src={`data:${userData.user.image.contentType};base64,${userData.user?.image.base64Data}`}
                        alt={userData.user.firstName}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <User
                        size={32}
                        className="text-gray-500 dark:text-gray-400"
                      />
                    )}
                  </div>

                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="mr-2">
                        <h2 className="text-xl font-bold">
                          {userData.user?.firstName} {userData.user?.lastName}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {userData.user?.email}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              userData.user?.roles.includes("ADMIN")
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                : userData.user?.roles.includes("MERCHANT")
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {userData.user?.roles.includes("ADMIN")
                              ? t("admin.admin").toUpperCase()
                              : userData.user?.roles.includes("MERCHANT")
                              ? t("admin.merchant").toUpperCase()
                              : t("admin.user").toUpperCase()}
                          </span>

                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              userData.user?.enabled === true
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : userData.user?.enabled === false
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            }`}
                          >
                            {userData.user?.enabled ? "ACTIVE" : "BANNED"}
                          </span>
                          {userData.user?.deleted && (
                            <span
                              className={`px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`}
                            >
                              DELETED
                            </span>
                          )}
                          {/* Ban Duration */}
                          {!userData.user?.enabled &&
                            userData.user?.banExpirationTime && (
                              <span
                                className={`px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`}
                              >
                                {t("admin.banExpires")}:{" "}
                                {formatDateTime(
                                  userData.user.banExpirationTime
                                )}
                              </span>
                            )}
                        </div>
                      </div>

                      <div className="mt-3 sm:mt-0 grid grid-cols-2 grid-rows-2 gap-4">
                        {isEditing ? (
                          <>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsEditing(false);
                                setEditedUser(userData.user);
                              }}
                              className="px-4 py-2"
                            >
                              {t("common.cancel")}
                            </Button>
                            <Button
                              onClick={handleSaveChanges}
                              className="px-4 py-2"
                            >
                              {t("common.save")}
                            </Button>
                          </>
                        ) : (
                          <Button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {t("common.edit")}
                          </Button>
                        )}

                        {userData.user?.image && (
                          <Button
                            variant="outline"
                            onClick={() =>
                              handleDeleteAvatar(userData.user?.userId ,userData.user?.image)
                            }
                            className="text-red-500 px-4 py-2"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            {t("admin.deleteAvatar")}
                          </Button>
                        )}

                        {!userData.user?.enabled ? (
                          <Button
                            variant="outline"
                            onClick={handleUnbanUser}
                            className="text-green-500 px-4 py-2"
                          >
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            {t("admin.unbanUser")}
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            onClick={() =>
                              document
                                .getElementById("ban-controls")
                                ?.classList.toggle("hidden")
                            }
                            className="text-red-500 px-4 py-2"
                          >
                            <ShieldX className="mr-2 h-4 w-4" />
                            {t("admin.banUser")}
                          </Button>
                        )}

                        {/* Delete Account Button */}
                        {userData.user?.deleted ? (
                          <>
                            <Button
                              variant="outline"
                              onClick={handleRestoreUser}
                              className="text-green-500 px-4 py-2"
                            >
                              <ShieldCheck className="mr-2 h-4 w-4" />
                              {t("admin.restoreAccount")}
                            </Button>

                            <Button
                              variant="outline"
                              onClick={handleDeleteUser}
                              className="text-red-500 px-4 py-2"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              {t("admin.deleteAccount")}
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </div>

                    <div
                      id="ban-controls"
                      className="hidden mt-3 p-3 border rounded-md"
                    >
                      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <div className="flex-grow">
                          <Label htmlFor="ban-duration">
                            {t("admin.banDuration")}
                          </Label>
                          <select
                            id="ban-duration"
                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={banDuration}
                            onChange={(e) => setBanDuration(e.target.value)}
                          >
                            <option value="1">1 {t("admin.day")}</option>
                            <option value="7">7 {t("admin.days")}</option>
                            <option value="30">30 {t("admin.days")}</option>
                            <option value="90">90 {t("admin.days")}</option>
                            <option value="0">{t("admin.permanent")}</option>
                          </select>
                        </div>
                        <Button
                          className="mt-6 sm:mt-0"
                          variant="destructive"
                          onClick={handleBanUser}
                        >
                          {t("admin.confirmBan")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for different user data sections */}
            <Tabs
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
                <TabsTrigger value="profile">{t("admin.profile")}</TabsTrigger>
                <TabsTrigger value="activity">
                  {t("admin.activity")}
                </TabsTrigger>
                <TabsTrigger value="orders">{t("admin.orders")}</TabsTrigger>
                <TabsTrigger value="reviews">{t("admin.reviews")}</TabsTrigger>
                {userData.user?.roles.includes("MERCHANT") && (
                  <TabsTrigger value="products">
                    {t("admin.products")}
                  </TabsTrigger>
                )}
              </TabsList>

              {/* Profile Tab Content */}
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("admin.personalInfo")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">{t("user.firstName")}</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={
                            isEditing
                              ? editedUser?.firstName
                              : userData.user?.firstName
                          }
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">{t("user.lastName")}</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={
                            isEditing
                              ? editedUser?.lastName
                              : userData.user?.lastName
                          }
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t("user.email")}</Label>
                        <Input
                          id="email"
                          name="email"
                          value={
                            isEditing ? editedUser?.email : userData.user?.email
                          }
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">{t("user.phone")}</Label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          value={
                            isEditing
                              ? editedUser?.phoneNumber
                              : userData.user?.phoneNumber
                          }
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("admin.accountInfo")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {t("admin.accountCreated")}
                        </p>
                        <p className="mt-1">
                          {formatDateTime(userData.user?.createdTime)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {t("admin.lastUpdated")}
                        </p>
                        <p className="mt-1">
                          {formatDateTime(userData.user?.updatedTime)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {t("admin.totalSpent")}
                        </p>
                        <p className="mt-1">
                          ${userData.user?.totalSpent.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {t("admin.orderCount")}
                        </p>
                        <p className="mt-1">{userData.user?.orderCount}</p>
                      </div>
                      {userData.user?.enabled &&
                        userData.user?.banExpirationTime && (
                          <div>
                            <p className="text-sm font-medium text-red-500">
                              {t("admin.banExpires")}
                            </p>
                            <p className="mt-1">
                              {formatDateTime(userData.user?.banExpirationTime)}
                            </p>
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("admin.addresses")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userData.user?.addresses.map((address: any) => (
                        <div
                          key={address.id}
                          className="p-4 border rounded-lg relative"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                              <MapPin
                                size={16}
                                className="text-muted-foreground mr-1"
                              />
                              <span className="font-medium">
                                {address.type}
                              </span>
                            </div>
                            {address.isDefault && (
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                                {t("address.default")}
                              </span>
                            )}
                          </div>
                          <div className="space-y-1">
                            <p>{address.addressLine1}</p>
                            <p>
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                            <p>{address.country}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Tab Content */}
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("admin.activityLogs")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-0 before:ml-[9px] before:border-l-2 before:border-gray-200 dark:before:border-gray-700">
                        {userData.logs?.map((log: ActionLog) => (
                          <div key={log.actionId} className="relative pb-6">
                            <div className="absolute left-0 -translate-x-1/2 h-4 w-4 rounded-full bg-blue-500 border-2 border-white dark:border-gray-900"></div>
                            <div className="pl-6">
                              <p className="text-sm text-muted-foreground">
                                {formatDateTime(log.timestamp)}
                              </p>
                              <h4 className="font-medium">
                                {log.action === "LOGIN" && (
                                  <LogOut
                                    size={14}
                                    className="inline mr-1 rotate-180"
                                  />
                                )}
                                {log.action === "ORDER_PLACED" && (
                                  <Package size={14} className="inline mr-1" />
                                )}
                                {log.action === "PROFILE_UPDATE" && (
                                  <Edit size={14} className="inline mr-1" />
                                )}
                                {log.action === "REVIEW_ADDED" && (
                                  <Star size={14} className="inline mr-1" />
                                )}
                                {log.action.replace("_", " ")}
                              </h4>
                              <p className="text-sm">{log.details}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Tab Content */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("admin.orderHistory")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userData.orders?.map((order: OrderBriefDTO) => (
                        <div
                          key={order.orderId}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2">
                                <Package
                                  size={16}
                                  className="text-muted-foreground"
                                />
                                <span className="font-medium">
                                  {order.orderId}
                                </span>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    order.orderStatus === "DELIVERED"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                      : order.orderStatus === "PROCESSING"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                      : order.orderStatus === "RETURNED"
                                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                  }`}
                                >
                                  {order.orderStatus}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {formatDateTime(order.orderDateTime)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                ${order.total.toFixed(2)}
                              </p>
                              <Button
                                variant="link"
                                size="sm"
                                className="h-6 p-0"
                                onClick={() =>
                                  navigate(`/admin/orders/${order.orderId}`)
                                }
                              >
                                {t("common.view")}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews Tab Content */}
              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("admin.userReviews")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userData.reviews?.length > 0 ? (
                        userData.reviews?.map((review: ReviewDTO) => (
                          <div
                            key={review.reviewId}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">
                                  {review.productName}
                                </h4>
                                <div className="flex items-center gap-1 mt-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      size={16}
                                      className={
                                        i < review.rating
                                          ? "text-yellow-500 fill-yellow-500"
                                          : "text-gray-300"
                                      }
                                    />
                                  ))}
                                  <span className="text-sm text-muted-foreground ml-1">
                                    {formatDate(review.reviewDateTime)}
                                  </span>
                                </div>
                                <p className="mt-2 text-sm">{review.comment}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDeleteReview(review.reviewId)
                                }
                                className="h-8 w-8 p-0 text-red-500"
                              >
                                <Trash size={16} />
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">
                            {t("admin.noReviews")}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Products Tab Content (Only for Merchants) */}
              {userData.user?.roles.includes("MERCHANT") && (
                <TabsContent value="products">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("admin.merchantProducts")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userData.products?.map(
                          (product: AdminProductBriefDTO) => (
                            <div
                              key={product.productId}
                              className="border rounded-lg p-4"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-medium">
                                    {product.productName}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm text-muted-foreground">
                                      ${product.price.toFixed(2)}
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                      {product.enabled ? "ACTIVE" : "DISABLED"}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      navigate(
                                        `/admin/products/edit/${product.productId}`
                                      )
                                    }
                                  >
                                    <Edit size={16} className="mr-1" />
                                    {t("common.edit")}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetailsPage;
