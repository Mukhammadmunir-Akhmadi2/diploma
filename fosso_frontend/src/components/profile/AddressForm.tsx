import React from "react";
import { useLanguage } from "../../hooks/useLanguage";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import type { Address } from "../../types/user";

interface AddressFormProps {
  onSubmit: (data: Address) => void;
  onCancel: () => void;
  defaultValues?: Partial<Address>;
  onClose?: () => void;
}

// Validation schema using Yup
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
const AddressForm: React.FC<AddressFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues,
  onClose,
}) => {
  const { t } = useLanguage();

  const initialValues: Partial<Address> = defaultValues || {
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

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={AddressValidationSchema}
      onSubmit={(values) => {
        onSubmit(values as Address);
        if (onClose) onClose();
      }}
    >
      {({ handleSubmit, handleChange, values }) => (
        <Form onSubmit={handleSubmit} className="space-y-4">
          {/* Address Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("profile.addressType")}
            </label>
            <Field
              name="addressType"
              as={Input}
              placeholder={t("profile.addressTypePlaceholder")}
              className="mt-1"
            />
            <ErrorMessage
              name="addressType"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("profile.phoneNumber")}
            </label>
            <Field
              name="phoneNumber"
              as={Input}
              placeholder={t("profile.phoneNumberPlaceholder")}
              className="mt-1"
            />
            <ErrorMessage
              name="phoneNumber"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Address Line 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("profile.addressLine1")}
            </label>
            <Field
              name="addressLine1"
              as={Input}
              placeholder={t("profile.addressLine1Placeholder")}
              className="mt-1"
            />
            <ErrorMessage
              name="addressLine1"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("profile.addressLine2")}
            </label>
            <Field
              name="addressLine2"
              as={Input}
              placeholder={t("profile.addressLine2Placeholder")}
              className="mt-1"
            />
            <ErrorMessage
              name="addressLine2"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* City and State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("profile.city")}
              </label>
              <Field
                name="city"
                as={Input}
                placeholder={t("profile.cityPlaceholder")}
                className="mt-1"
              />
              <ErrorMessage
                name="city"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("profile.state")}
              </label>
              <Field
                name="state"
                as={Input}
                placeholder={t("profile.statePlaceholder")}
                className="mt-1"
              />
              <ErrorMessage
                name="state"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          </div>

          {/* Postal Code and Country */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("profile.zipCode")}
              </label>
              <Field
                name="postalCode"
                as={Input}
                placeholder={t("profile.zipCodePlaceholder")}
                className="mt-1"
              />
              <ErrorMessage
                name="postalCode"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("profile.country")}
              </label>
              <Field
                name="country"
                as={Input}
                placeholder={t("profile.countryPlaceholder")}
                className="mt-1"
              />
              <ErrorMessage
                name="country"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          </div>

          {/* Default Address Checkbox */}
          <div className="flex items-center">
            <Field
              type="checkbox"
              name="isDefault"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
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
        </Form>
      )}
    </Formik>
  );
};

export default AddressForm;
