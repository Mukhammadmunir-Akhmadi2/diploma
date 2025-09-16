import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { useLanguage } from "../hooks/useLanguage";

interface LogInDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const LogInDialog: React.FC<LogInDialogProps> = ({ isOpen, setIsOpen }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    setIsOpen(false);
    // Redirect to the login page
    navigate("/login");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("auth.loginRequired")}</DialogTitle>
          <DialogDescription>{t("auth.loginToSubmitReview")}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            {t("auth.cancel")}
          </Button>
          <Button onClick={handleGoToLogin}>{t("auth.goToLogin")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogInDialog;
