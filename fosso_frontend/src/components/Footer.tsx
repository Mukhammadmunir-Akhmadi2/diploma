import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-white dark:bg-gray-950 border-t dark:border-gray-800">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
              Fosso
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
              {t("footer.shopping")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/new-in"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                >
                  {t("nav.new")}
                </Link>
              </li>
              <li>
                <Link
                  to="/brands"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                >
                  {t("nav.brands")}
                </Link>
              </li>
              <li>
                <Link
                  to="/womenswear"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                >
                  {t("nav.women")}
                </Link>
              </li>
              <li>
                <Link
                  to="/menswear"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                >
                  {t("nav.men")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
              {t("footer.help")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/customer-care"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                >
                  {t("footer.customerCare")}
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                >
                  {t("footer.shipping")}
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                >
                  {t("footer.faq")}
                </Link>
              </li>
              <li>
                <Link
                  to="/size-guide"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                >
                  {t("footer.sizeGuide")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                >
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
              {t("footer.about")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                >
                  {t("footer.aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                >
                  {t("footer.careers")}
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                >
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                >
                  {t("footer.terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t dark:border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} Fosso Fashion. {t("footer.rights")}
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("footer.designed")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
