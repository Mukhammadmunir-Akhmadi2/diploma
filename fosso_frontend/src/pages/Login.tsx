import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { useToast } from "../hooks/useToast";
import { login } from "../api/Auth";
import { useMutation } from "@tanstack/react-query";
import { type ErrorResponse } from "../types/error";
import { type AuthRequest, type AuthResponse } from "../types/auth";
import * as Yup from "yup";
import { useLoginHandler } from "../hooks/useLoginHandler";
import { Spin } from "antd";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const Login = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { handleLoginSuccess } = useLoginHandler();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("login.invalidEmail"))
      .required(t("login.required")),
    password: Yup.string()
      .min(6, t("login.passwordTooShort"))
      .required(t("login.required")),
    rememberMe: Yup.boolean(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthRequest & { rememberMe: boolean }>({
    defaultValues: {
      email: localStorage.getItem("email") || "",
      password: "",
      rememberMe: localStorage.getItem("rememberMe") === "true",
    },
    resolver: yupResolver(validationSchema),
  });

  const [isPasswordVisible, setPasswordVisible] = useState(false); // State for toggling password visibility

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async (data: AuthResponse) => {
      handleLoginSuccess(data);
      toast({
        title: t("login.success"),
        description: t("login.redirecting"),
      });
      navigate("/");
    },
    onError: (error: any) => {
      const errorResponse = error as ErrorResponse;
      console.error("Login error:", errorResponse);

      if (errorResponse?.status === 404) {
        // Handle 404 error (e.g., user banned or not found)
        toast({
          title: t("login.failed"),
          description: errorResponse.message || t("login.userNotFound"),
          variant: "default",
        });
      } else {
        // Handle other errors
        toast({
          title: t("login.failed"),
          description: error.message || t("login.error"),
          variant: "destructive",
        });
      }
      loginMutation.reset();
    },
  });

  const goBack = () => navigate(-1);

  if (loginMutation.isPending) {
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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex-grow flex items-center justify-center">
        <div className="min-h-screen w-full bg-white dark:bg-gray-900 overflow-hidden shadow-2xl flex relative">
          <button
            onClick={goBack}
            className="absolute top-4 left-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full z-50"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="sr-only">{t("back")}</span>
          </button>

          <div className="w-1/2 hidden md:flex bg-gradient-to-b from-gray-800 to-gray-900 text-white p-12 flex-col justify-center relative overflow-hidden">
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-3xl font-bold mb-6">{t("welcome")}</h2>
              <div className="text-5xl font-bold">FOSSO</div>
              <p className="opacity-80 text-center mt-8">
                {t("login.description")}
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
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center md:text-left">
                {t("login.title")}
              </h2>

              <form
                className="space-y-6"
                onSubmit={handleSubmit((data) => {
                  if (data.rememberMe) {
                    localStorage.setItem("rememberMe", "true");
                    localStorage.setItem("email", data.email); // optional
                  } else {
                    localStorage.removeItem("rememberMe");
                    localStorage.removeItem("email");
                  }

                  loginMutation.mutate({
                    email: data.email,
                    password: data.password,
                  });
                })}
              >
                <div className="space-y-2">
                  <Label htmlFor="email">{t("login.email")}</Label>
                  <Input
                    type="email"
                    placeholder={t("login.emailPlaceholder")}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}{" "}
                    </p>
                  )}
                </div>

                <div className="space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">{t("login.password")}</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {t("login.forgotPassword")}
                    </Link>
                  </div>
                  <Input
                    type={isPasswordVisible ? "text" : "password"} // Toggle between text and password
                    placeholder={t("login.passwordPlaceholder")}
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-9 text-gray-500"
                  >
                    {isPasswordVisible ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    {...register("rememberMe")}
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-sm font-medium leading-none"
                  >
                    {t("login.rememberMe")}
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting || loginMutation.isPending}
                >
                  {t("login.submit")}
                </Button>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  {t("login.noAccount")}{" "}
                  <Link to="/signup" className="text-blue-600 hover:underline">
                    {t("login.signup")}
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

export default Login;
