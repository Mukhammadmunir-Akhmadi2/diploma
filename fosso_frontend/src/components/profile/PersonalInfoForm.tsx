import React from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { useOutletContext } from "react-router-dom";
import { Button } from "../../components/ui/button";
import type { UserProfileDTO, UserUpdateDTO } from "../../types/user";
import type { Gender } from "../../types/enums";
import { checkEmailUnique } from "../../api/Auth";
import { updateCurrentUser } from "../../api/User";
import { useToast } from "../ui/use-toast";
import type { ErrorResponse } from "../../types/error";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface PersonalInfoFormProps {
  user: UserProfileDTO;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

const PersonalInfoForm: React.FC = () => {
  const { user, setUser } = useOutletContext<PersonalInfoFormProps>();
  
  const schema = Yup.object({
    firstName: Yup.string().required(),
    lastName: Yup.string(),
    email: Yup.string().email().required(),
    phoneNumber: Yup.string().required(),
  });

  const { toast } = useToast();
  const { t } = useLanguage();
  const [emailError, setEmailError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProfileDTO>({
    defaultValues: {
      ...user,
    },
    resolver: yupResolver(schema),
  });

  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setEmailError(null); // reset error

    try {
      await checkEmailUnique(email, user.userId);
    } catch (error: any) {
      const errorResponse = error as ErrorResponse;
      setEmailError(errorResponse?.message || t("error.emailValidationFailed"));
      console.error("Error checking email uniqueness:", errorResponse);
    }
  };

  const handleSave: SubmitHandler<UserProfileDTO> = async (
    user: UserProfileDTO
  ) => {
    const phoneNumber = user.phoneNumber;
    const dateOfBirth = user.dateOfBirth;
    const gender = user.gender;

    const changedUser: UserUpdateDTO = {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber:
        phoneNumber && phoneNumber.trim() !== "" ? phoneNumber : null,
      dateOfBirth:
        dateOfBirth && dateOfBirth.trim() !== "" ? dateOfBirth : null,
      gender: gender && gender.trim() !== "" ? (gender as Gender) : null,
      isPhoneNumberPrivate: user.isPhoneNumberPrivate,
      isDateOfBirthPrivate: user.isDateOfBirthPrivate,
      isGenderPrivate: user.isGenderPrivate,
    };

    try {
      const updatedUser = await updateCurrentUser(changedUser);
      setUser(updatedUser);
      toast({
        title: t("profile.updateSuccess"),
        description: t("profile.updateSuccessMessage"),
      });
    } catch (error: any) {
      const errorResponse = error as ErrorResponse;
      toast({
        title: t("error.updateFailed"),
        description: errorResponse?.message || t("error.tryAgain"),
        variant: "destructive",
      });
      console.error("Error updating user:", errorResponse);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6">{t("profile.personalInfo")}</h2>
      <form onSubmit={handleSubmit(handleSave)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("profile.firstName")}
            </label>
            <input
              type="text"
              {...register("firstName")}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.firstName && <p>{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("profile.lastName")}
            </label>
            <input
              type="text"
              {...register("lastName")}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("profile.email")}
            </label>
            <input
              type="email"
              {...register("email")}
              onChange={handleEmailChange}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            {emailError && (
              <p className="top-full mt-1 text-sm text-red-600 dark:text-red-400 absolute">
                {emailError}
              </p>
            )}
          </div>
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("profile.phoneNumber")}
              </label>
              <input
                type="tel"
                {...register("phoneNumber")}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mt-6 flex items-center ml-2">
              <input
                id="phone-private"
                type="checkbox"
                {...register("isPhoneNumberPrivate")}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="phone-private"
                className="ml-2 block text-sm text-gray-500 dark:text-gray-400"
              >
                {t("profile.private")}
              </label>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("profile.dateOfBirth")}
              </label>
              <input
                type="date"
                {...register("dateOfBirth")}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mt-6 flex items-center ml-2">
              <input
                id="dob-private"
                type="checkbox"
                {...register("isDateOfBirthPrivate")}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="dob-private"
                className="ml-2 block text-sm text-gray-500 dark:text-gray-400"
              >
                {t("profile.private")}
              </label>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("profile.gender")}
              </label>
              <select
                {...register("gender")}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="MALE">{t("profile.male")}</option>
                <option value="FEMALE">{t("profile.female")}</option>
              </select>
            </div>
            <div className="mt-6 flex items-center ml-2">
              <input
                id="gender-private"
                type="checkbox"
                {...register("isGenderPrivate")}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="gender-private"
                className="ml-2 block text-sm text-gray-500 dark:text-gray-400"
              >
                {t("profile.private")}
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <Button type="button" variant="outline">
            {t("common.cancel")}
          </Button>
          <Button type="submit">{t("common.save")}</Button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoForm;
