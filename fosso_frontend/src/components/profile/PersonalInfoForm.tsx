import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { Button } from "../../components/ui/button";
import type { UserProfileDTO, UserUpdateDTO } from "../../types/user";
import type { Gender } from "../../types/enums";
import { checkEmailUnique } from "../../api/Auth";
import { updateCurrentUser } from "../../api/User";
import { useToast } from "../ui/use-toast";
import type { ErrorResponse } from "../../types/error";

interface PersonalInfoFormProps {
  user: UserProfileDTO;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  user,
  setUser,
}) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [emailError, setEmailError] = React.useState<string | null>(null);

  const [isPhoneNumberPrivate, setIsPhoneNumberPrivate] = React.useState(
    user.isPhoneNumberPrivate
  );
  const [isDateOfBirthPrivate, setIsDateOfBirthPrivate] = React.useState(
    user.isDateOfBirthPrivate
  );
  const [isGenderPrivate, setIsGenderPrivate] = React.useState(
    user.isGenderPrivate
  );

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const formObject = Object.fromEntries(formData.entries());

    const phoneNumber = formObject.phoneNumber as string;
    const dateOfBirth = formObject.dateOfBirth as string;
    const gender = formObject.gender as string;

    console.log(isPhoneNumberPrivate);
    const changedUser: UserUpdateDTO = {
      userId: user.userId,
      firstName: formObject.firstName as string,
      lastName: formObject.lastName as string,
      email: formObject.email as string,
      phoneNumber:
        phoneNumber && phoneNumber.trim() !== "" ? phoneNumber : null,
      dateOfBirth:
        dateOfBirth && dateOfBirth.trim() !== "" ? dateOfBirth : null,
      gender: gender && gender.trim() !== "" ? (gender as Gender) : null,
      isPhoneNumberPrivate,
      isDateOfBirthPrivate,
      isGenderPrivate,
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
      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("profile.firstName")}
            </label>
            <input
              type="text"
              name="firstName"
              defaultValue={user.firstName}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("profile.lastName")}
            </label>
            <input
              type="text"
              name="lastName"
              defaultValue={user.lastName}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("profile.email")}
            </label>
            <input
              type="email"
              name="email"
              defaultValue={user.email}
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
                name="phoneNumber"
                defaultValue={user.phoneNumber}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mt-6 flex items-center ml-2">
              <input
                id="phone-private"
                name="isPhoneNumberPrivate"
                type="checkbox"
                checked={isPhoneNumberPrivate}
                onChange={(e) => setIsPhoneNumberPrivate(e.target.checked)}
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
                name="dateOfBirth"
                defaultValue={user.dateOfBirth}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mt-6 flex items-center ml-2">
              <input
                id="dob-private"
                name="isDateOfBirthPrivate"
                type="checkbox"
                checked={isDateOfBirthPrivate}
                onChange={(e) => setIsDateOfBirthPrivate(e.target.checked)}
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
                name="gender"
                defaultValue={user.gender}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="MALE">{t("profile.male")}</option>
                <option value="FEMALE">{t("profile.female")}</option>
              </select>
            </div>
            <div className="mt-6 flex items-center ml-2">
              <input
                id="gender-private"
                name="isGenderPrivate"
                type="checkbox"
                checked={isGenderPrivate}
                onChange={(e) => setIsGenderPrivate(e.target.checked)}
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
