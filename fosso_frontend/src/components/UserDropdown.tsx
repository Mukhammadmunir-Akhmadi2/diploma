import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { UserRound, LogOut, User, Settings } from "lucide-react";
import { Button } from "../components/ui/button";
import { useLanguage } from "../hooks/useLanguage";
import { type UserDTO } from "../types/user";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../slices/authSlice";
import type { ImageDTO } from "../types/image";

interface UserDropdownProps {
  user: UserDTO | null;
  isLoggedIn: boolean;
  avatar: ImageDTO | null;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  user,
  isLoggedIn,
  avatar,
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const getInitials = () => {
    if (!user) return "";
    return `${user.firstName.charAt(0)}${
      user.lastName ? user.lastName.charAt(0) : ""
    }`.toUpperCase();
  };

  const getPrimaryRole = () => {
    if (!user || !user.roles || user.roles.length === 0)
      return t("common.customer");

    if (user.roles.includes("ADMIN")) return t("common.admin");
    if (user.roles.includes("MERCHANT")) return t("common.merchant");
    return t("common.customer");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-10 w-10 p-0"
          aria-label={isLoggedIn ? t("account.myAccount") : t("account.login")}
        >
          {isLoggedIn && user ? (
            <Avatar className="h-9 w-9 border border-muted">
              {avatar ? (
                <AvatarImage
                  src={`data:${avatar.contentType};base64,${avatar.base64Data}`}
                  alt={`${user.firstName} ${user.lastName}`}
                />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials()}
                </AvatarFallback>
              )}
            </Avatar>
          ) : (
            <UserRound className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        {isLoggedIn && user ? (
          <>
            <div className="flex flex-col px-4 py-3">
              <p className="font-medium text-base">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-1">
                <span className="text-xs bg-primary/10 text-primary dark:bg-primary/20 px-2 py-0.5 rounded-full">
                  {getPrimaryRole()}
                </span>
              </div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link
                to="/profile"
                className="cursor-pointer flex w-full items-center"
              >
                <User className="mr-2 h-4 w-4" />
                {t("account.viewProfile")}
              </Link>
            </DropdownMenuItem>

            {user.roles.includes("MERCHANT") && (
              <DropdownMenuItem asChild>
                <Link
                  to="/merchant/dashboard"
                  className="cursor-pointer flex w-full items-center"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  {t("account.merchantDashboard")}
                </Link>
              </DropdownMenuItem>
            )}

            {user.roles.includes("ADMIN") && (
              <DropdownMenuItem asChild>
                <Link
                  to="/admin/users"
                  className="cursor-pointer flex w-full items-center"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  {t("account.adminDashboard")}
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(logout());
                  navigate("/");
                }}
                className="cursor-pointer flex w-full items-center text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t("account.logout")}
              </button>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <div className="px-4 py-3 text-center">
              <p className="font-medium">{t("account.notLoggedIn")}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t("account.loginPrompt")}
              </p>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link
                to="/login"
                className="cursor-pointer flex w-full items-center justify-center"
              >
                <Button className="w-full">{t("account.login")}</Button>
              </Link>
            </DropdownMenuItem>

            <div className="px-4 py-2 text-center">
              <p className="text-sm text-muted-foreground">
                {t("account.noAccount")}{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  {t("account.signUp")}
                </Link>
              </p>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
