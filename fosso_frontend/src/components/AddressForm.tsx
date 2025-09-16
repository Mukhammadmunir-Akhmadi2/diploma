import React from "react";
import { useLanguage } from "../hooks/useLanguage";
import * as Yup from "yup";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import type { Address } from "../types/user";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface AddressFormProps {
  onSubmit: (data: Address) => void;
  onCancel: () => void;
  defaultValues?: Address;
  onClose?: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues,
  onClose,
}) => {
  const { t } = useLanguage();
  const initialValues: Address = defaultValues || {
    addressType: "home",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
    isDefault: false,
  };

  const AddressValidationSchema = Yup.object().shape({
    addressType: Yup.string().required("Address type is required"),
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(
        /^\+?[1-9]\d{1,14}$/,
        "Phone number must be a valid international number (e.g., +123456789)"
      ),
    addressLine1: Yup.string()
      .required("Address line 1 is required")
      .max(100, "Address line 1 must be less than 100 characters"),
    addressLine2: Yup.string().max(
      100,
      "Address line 2 must be less than 100 characters"
    ),
    city: Yup.string()
      .required("City is required")
      .max(50, "City must be less than 50 characters"),
    state: Yup.string()
      .required("State is required")
      .max(50, "State must be less than 50 characters"),
    postalCode: Yup.string()
      .required("Postal code is required")
      .max(20, "Postal code must be less than 20 characters"),
    country: Yup.string()
      .required("Country is required")
      .max(50, "Country must be less than 50 characters"),
    isDefault: Yup.boolean(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Address>({
    defaultValues: initialValues,
    resolver: yupResolver(AddressValidationSchema),
  });

  const submitHandler: SubmitHandler<Address> = (data: Address) => {
    onSubmit(data);
    if (onClose) onClose();
  };
  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      {/* Address Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("profile.addressType")}
        </label>
        <Input
          placeholder={t("profile.addressTypePlaceholder")}
          className="mt-1"
          {...register("addressType")}
        />
        {errors.addressType && (
          <p className="text-red-500 text-sm mt-1">
            {errors.addressType.message}
          </p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("profile.phoneNumber")}
        </label>
        <Input
          placeholder={t("profile.phoneNumberPlaceholder")}
          className="mt-1"
          {...register("phoneNumber")}
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-sm mt-1">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>

      {/* Address Line 1 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("profile.addressLine1")}
        </label>
        <Input
          placeholder={t("profile.addressLine1Placeholder")}
          className="mt-1"
          {...register("addressLine1")}
        />
        {errors.addressLine1 && (
          <p className="text-red-500 text-sm mt-1">
            {errors.addressLine1.message}
          </p>
        )}
      </div>

      {/* Address Line 2 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("profile.addressLine2")}
        </label>
        <Input
          placeholder={t("profile.addressLine2Placeholder")}
          className="mt-1"
          {...register("addressLine2")}
        />
        {errors.addressLine2 && (
          <p className="text-red-500 text-sm mt-1">
            {errors.addressLine2.message}
          </p>
        )}
      </div>

      {/* City and State */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("profile.city")}
          </label>
          <Input
            placeholder={t("profile.cityPlaceholder")}
            className="mt-1"
            {...register("city")}
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("profile.state")}
          </label>
          <Input
            placeholder={t("profile.statePlaceholder")}
            className="mt-1"
            {...register("state")}
          />
          {errors.state && (
            <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
          )}
        </div>
      </div>

      {/* Postal Code and Country */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("profile.zipCode")}
          </label>
          <Input
            placeholder={t("profile.zipCodePlaceholder")}
            className="mt-1"
            {...register("postalCode")}
          />
          {errors.postalCode && (
            <p className="text-red-500 text-sm mt-1">
              {errors.postalCode.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("profile.country")}
          </label>
          <Input
            placeholder={t("profile.countryPlaceholder")}
            className="mt-1"
            {...register("country")}
          />
          {errors.country && (
            <p className="text-red-500 text-sm mt-1">
              {errors.country.message}
            </p>
          )}
        </div>
      </div>

      {/* Default Address Checkbox */}
      <div className="flex items-center">
        <Input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          {...register("isDefault")}
        />
        <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          {t("address.setAsDefault")}
        </label>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
        <Button type="submit">{t("common.save")}</Button>
      </div>
    </form>
  );
};

export default AddressForm;
