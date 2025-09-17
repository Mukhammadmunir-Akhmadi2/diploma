import {
  Package,
  PackageCheck,
  Truck,
  BadgeDollarSign,
  CheckCircle,
  XCircle,
  RotateCcw,
} from "lucide-react";
import type { OrderStatus } from "../types/enums";

export const getStatusClass = (status: OrderStatus) => {
  switch (status) {
    case "NEW":
      return "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300";

    case "PROCESSING":
      return "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300";

    case "SHIPPED":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";

    case "DELIVERED":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";

    case "PAID":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";

    case "RETURNED":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";

    case "COMPLETED":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";

    case "CANCELLED":
      return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300";

    case "REFUNDED":
      return "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300";

    default:
      return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
  }
};

export const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case "NEW":
      return <Package className="h-5 w-5 text-sky-600" />;

    case "PROCESSING":
      return <PackageCheck className="h-5 w-5 text-lime-600" />;

    case "SHIPPED":
      return <Truck className="h-5 w-5 text-indigo-600" />;

    case "DELIVERED":
      return <Truck className="h-5 w-5 text-emerald-600" />;

    case "PAID":
      return <BadgeDollarSign className="h-5 w-5 text-emerald-600" />;

    case "COMPLETED":
      return <CheckCircle className="h-5 w-5 text-green-600" />;

    case "CANCELLED":
      return <XCircle className="h-5 w-5 text-rose-600" />;

    case "RETURNED":
      return <XCircle className="h-5 w-5 text-amber-600" />;

    case "REFUNDED":
      return <RotateCcw className="h-5 w-5 text-teal-600" />;

    default:
      return <Package className="h-5 w-5 text-slate-500" />;
  }
};
