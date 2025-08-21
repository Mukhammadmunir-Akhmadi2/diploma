import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";

const Terms = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={goBack}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>{t("terms.back")}</span>
        </button>

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          {t("terms.title")}
        </h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300">{t("terms.intro")}</p>

          <h2 className="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-white">
            {t("terms.acceptance.title")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            {t("terms.acceptance.description")}
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-white">
            {t("terms.accounts.title")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            {t("terms.accounts.description")}
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-white">
            {t("terms.privacy.title")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            {t("terms.privacy.description")}
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-white">
            {t("terms.ip.title")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            {t("terms.ip.description")}
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-white">
            {t("terms.changes.title")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            {t("terms.changes.description")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
