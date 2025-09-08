import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { useToast } from "../hooks/useToast";
import {
  useRegisterMutation,
  useLazyCheckEmailUniqueQuery,
} from "../api/AuthApiSlice";
import { type ErrorResponse } from "../types/error";
import { Spin } from "antd";
import * as Yup from "yup";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { RegisterForm, RegisterRequest } from "../types/auth";
import { yupResolver } from "@hookform/resolvers/yup";

const Signup = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState<string | null>(null);
  const validationSchema = Yup.object({
    name: Yup.string().required(t("signup.nameRequired")),
    email: Yup.string()
      .email(t("signup.invalidEmail"))
      .required(t("signup.emailRequired")),
    phoneNumber: Yup.string().required(t("signup.phoneRequired")),
    password: Yup.string()
      .min(6, t("signup.passwordTooShort"))
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/,
        t("signup.passwordComplexity")
      )
      .required(t("signup.passwordRequired")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], t("signup.passwordsMustMatch"))
      .required(t("signup.confirmPasswordRequired")),
    agreeTerms: Yup.boolean()
      .oneOf([true], t("signup.mustAgreeTerms"))
      .required(t("signup.mustAgreeTerms")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
    resolver: yupResolver(validationSchema),
  });

  const [registerUser, { isLoading }] = useRegisterMutation();
  const [triggerCheckEmailUnique] = useLazyCheckEmailUniqueQuery();

  const onSubmit: SubmitHandler<RegisterForm> = async (values: RegisterForm) => {
    const [firstName, ...rest] = values.name.trim().split(" ");
    const lastName = rest.join(" ").trim();
    const payload: RegisterRequest = {
      firstName,
      lastName: lastName.length === 0 ? null : lastName,
      email: values.email,
      phoneNumber: values.phoneNumber,
      password: values.password,
    };

    try {
      await registerUser(payload).unwrap();

      toast({
        title: t("signup.success"),
        description: t("signup.redirecting"),
      });

      navigate("/login");
    } catch (error: any) {
      const errorResponse = error.data as ErrorResponse;
      console.error("Signup error:", errorResponse);
      toast({
        title: t("signup.failed"),
        description: errorResponse.message || t("signup.error"),
        variant: "destructive",
      });
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <Spin
          size="large"
          tip={t("login.loggingIn", { defaultValue: "Logging in..." })}
        />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <div className="min-h-screen w-full bg-white dark:bg-gray-900 overflow-hidden shadow-xl flex relative">
          <button
            onClick={goBack}
            className="absolute top-4 left-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full z-50"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>

          <div className="w-1/2 hidden md:flex bg-gradient-to-b from-gray-800 to-gray-900 text-white p-12 flex-col justify-center relative overflow-hidden">
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-3xl font-bold mb-6">{t("welcome")}</h2>
              <div className="text-5xl font-bold">FOSSO</div>
              <p className="opacity-80 text-center mt-8">
                {t("signup.description")}
              </p>
            </div>
            <div className="absolute right-0 inset-y-0">
              <svg
                className="h-full text-white opacity-10"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path d="M0,0 C40,33 66,52 75,100 H0 Z" fill="currentColor" />
                <path
                  d="M0,0 C40,30 80,40 100,100 H0 Z"
                  fill="currentColor"
                  className="opacity-50"
                />
                <path
                  d="M0,0 C40,40 60,60 70,100 H0 Z"
                  fill="currentColor"
                  className="opacity-25"
                />
              </svg>
            </div>
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center">
            <div className="w-full max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                {t("signup.title")}
              </h2>

              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2 relative">
                  <Label htmlFor="name">{t("signup.name")}</Label>
                  <Input
                    placeholder={t("signup.namePlaceholder")}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm absolute top-full">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 relative">
                  <Label htmlFor="email">{t("signup.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("signup.emailPlaceholder")}
                    {...register("email")}
                    onBlur={async (e) => {
                      try {
                        await triggerCheckEmailUnique({
                          email: e.target.value,
                        }).unwrap();
                        setEmailError(null);
                      } catch (error: any) {
                        const errMsg =
                          error?.data.message || t("error.emailValidationFailed");
                        setEmailError(errMsg);
                      }
                    }}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm absolute top-full">
                      {errors.email?.message}
                    </p>
                  )}
                  {emailError && (
                    <div className="text-red-500 text-sm absolute top-full">
                      {emailError}
                    </div>
                  )}
                </div>

                <div className="space-y-2 relative">
                  <Label htmlFor="phoneNumber">{t("signup.phone")}</Label>
                  <Input
                    type="tel"
                    placeholder={t("signup.phonePlaceholder")}
                    {...register("phoneNumber")}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm absolute top-full">
                      {errors.phoneNumber?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 relative">
                  <Label htmlFor="password">{t("signup.password")}</Label>
                  <Input
                    type="password"
                    placeholder={t("signup.passwordPlaceholder")}
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm top-full">
                      {errors.password?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 relative">
                  <Label htmlFor="confirmPassword">
                    {t("signup.confirmPassword")}
                  </Label>
                  <Input
                    type="password"
                    placeholder={t("signup.confirmPasswordPlaceholder")}
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm absolute top-full">
                      {errors.confirmPassword?.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 relative py-2">
                  <Input
                    type="checkbox"
                    className="h-4 w-4"
                    {...register("agreeTerms")}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {t("signup.termsAgreement")}{" "}
                    <Link to="/terms" className="text-blue-600 hover:underline">
                      {t("signup.termsLink")}
                    </Link>
                  </label>
                  {errors.agreeTerms && (
                    <p className="text-red-500 text-sm absolute top-full">
                      {errors.agreeTerms?.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {t("signup.submit")}
                </Button>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  {t("signup.haveAccount")}{" "}
                  <Link to="/login" className="text-blue-600 hover:underline">
                    {t("signup.login")}
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
