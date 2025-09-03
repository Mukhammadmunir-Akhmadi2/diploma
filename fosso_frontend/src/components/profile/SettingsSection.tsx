import React, { useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import { Bell, Shield } from "lucide-react";
import { changePassword, deleteUser } from "../../api/User";
import { useToast } from "../ui/use-toast";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { logout } from "../../slices/authSlice";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import type { PasswordChangeRequest } from "../../types/user";
import type { ErrorResponse } from "../../types/error";
import { Input } from "../ui/input";
import { yupResolver } from "@hookform/resolvers/yup";

const SettingsSection: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotions: false,
    profileVisibility: true,
    dataSharing: false,
    twoFactorAuth: false,
  });
  const [isChangePasswordModalVisible, setChangePasswordModalVisible] =
    useState(false);
  const [isDeactivateAccountModalVisible, setDeactivateAccountModalVisible] =
    useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };
  const handleToggleChange = (setting: string, checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: checked,
    }));
  };
  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required(t("profile.requiredField")),
    newPassword: Yup.string()
      .required(t("profile.requiredField"))
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/,
        t("signup.passwordComplexity")
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], t("profile.passwordsDoNotMatch"))
      .required(t("profile.requiredField")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleSaveSettings = () => {
    console.log("Saving settings:", settings);
  };

  const handleChangePassword = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      const passwordChanged: PasswordChangeRequest = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      };
      await changePassword(passwordChanged);
      toast({
        title: t("profile.passwordChanged"),
        description: t("profile.passwordChangedDesc"),
      });
      setChangePasswordModalVisible(false);
    } catch (error: any) {
      const response = error as ErrorResponse;
      if (response?.status === 401) {
        toast({
          title: t("profile.incorrectPassword"),
          description: t("profile.incorrectPasswordDesc"),
          variant: "destructive",
        });
      } else {
        toast({
          title: t("profile.errorChangingPassword"),
          description: t("profile.errorChangingPasswordDesc"),
          variant: "destructive",
        });
      }
    }
  };

  const handleDeactivateAccount = async () => {
    try {
      await deleteUser(); // Call the API to delete the user account

      // Show success toast
      toast({
        title: t("profile.accountDeactivated"),
        description: t("profile.accountDeactivatedDesc"),
      });

      logout();
      navigate("/");
    } catch (error: any) {
      console.error("Error deactivating account:", error);

      // Show error toast
      toast({
        title: t("profile.errorDeactivatingAccount"),
        description: t("profile.errorDeactivatingAccountDesc"),
        variant: "destructive",
      });
    } finally {
      setDeactivateAccountModalVisible(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6">{t("profile.settings")}</h2>

      <div className="space-y-8">
        {/* Notification Settings */}
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Bell size={18} />
            {t("profile.notifications")}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">
                {t("profile.emailNotifications")}
              </Label>
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  handleToggleChange("emailNotifications", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="order-updates">{t("profile.orderUpdates")}</Label>
              <Switch
                id="order-updates"
                checked={settings.orderUpdates}
                onCheckedChange={(checked) =>
                  handleToggleChange("orderUpdates", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="promotions">{t("profile.promotions")}</Label>
              <Switch
                id="promotions"
                checked={settings.promotions}
                onCheckedChange={(checked) =>
                  handleToggleChange("promotions", checked)
                }
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Shield size={18} />
            {t("profile.securitySettings")}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="two-factor-auth">
                  {t("profile.twoFactorAuth")}
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("profile.twoFactorAuthDescription")}
                </p>
              </div>
              <Switch
                id="two-factor-auth"
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) =>
                  handleToggleChange("twoFactorAuth", checked)
                }
              />
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div>
          <h3 className="text-lg font-medium mb-4">
            {t("profile.privacySettings")}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="profile-visibility">
                {t("profile.profileVisibility")}
              </Label>
              <Switch
                id="profile-visibility"
                checked={settings.profileVisibility}
                onCheckedChange={(checked) =>
                  handleToggleChange("profileVisibility", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="data-sharing">{t("profile.dataSharing")}</Label>
              <Switch
                id="data-sharing"
                checked={settings.dataSharing}
                onCheckedChange={(checked) =>
                  handleToggleChange("dataSharing", checked)
                }
              />
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div>
          <h3 className="text-lg font-medium mb-4">
            {t("profile.accountSettings")}
          </h3>
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => setChangePasswordModalVisible(true)}
            >
              {t("profile.changePassword")}
            </Button>
            <Button
              variant="outline"
              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900 hover:text-red-700"
              onClick={() => setDeactivateAccountModalVisible(true)}
            >
              {t("profile.deactivateAccount")}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleSaveSettings}>
          {t("profile.saveSettings")}
        </Button>
      </div>
      <Modal
        title={t("profile.changePassword")}
        visible={isChangePasswordModalVisible}
        onCancel={() => setChangePasswordModalVisible(false)}
        footer={null}
      >
        <form
          className="space-y-4"
          onSubmit={handleSubmit(handleChangePassword)}
        >
          {/* Current Password Field */}
          <div className="relative">
            <label htmlFor="currentPassword" className="block font-medium">
              {t("profile.currentPassword")}
            </label>
            <Input
              type={isPasswordVisible ? "text" : "password"} // Toggle between text and password
              className="w-full border rounded px-3 py-2"
              {...register("currentPassword")}
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm">
                {errors.currentPassword.message}
              </p>
            )}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-9 text-gray-500"
            >
              {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* New Password Field */}
          <div className="relative">
            <label htmlFor="newPassword" className="block font-medium">
              {t("profile.newPassword")}
            </label>
            <Input
              type={isPasswordVisible ? "text" : "password"} // Toggle between text and password
              className="w-full border rounded px-3 py-2"
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm">
                {errors.newPassword.message}
              </p>
            )}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-9 text-gray-500"
            >
              {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block font-medium">
              {t("profile.confirmPassword")}
            </label>
            <Input
              type="password"
              className="w-full border rounded px-3 py-2"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}{" "}
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setChangePasswordModalVisible(false)}
              className="mr-2"
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {t("common.save")}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Deactivate Account Modal */}
      <Modal
        title={t("profile.deactivateAccount")}
        visible={isDeactivateAccountModalVisible}
        onCancel={() => setDeactivateAccountModalVisible(false)}
        onOk={handleDeactivateAccount}
        okText={t("common.confirm")}
        cancelText={t("common.cancel")}
        okButtonProps={{ danger: true }}
      >
        <p>{t("profile.deactivateAccountConfirmation")}</p>
      </Modal>
    </div>
  );
};

export default SettingsSection;
