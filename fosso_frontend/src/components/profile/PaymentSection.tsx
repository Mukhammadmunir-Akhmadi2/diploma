import React, { useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { Button } from "../../components/ui/button";
import { PlusCircle, CreditCard, Edit, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useToast } from "../../hooks/useToast";
import PaymentForm, {
  type PaymentFormValues,
} from "../../components/profile/PaymentForm";

interface PaymentMethod {
  id: number;
  cardType: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  isDefault: boolean;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 1,
    cardType: "Visa",
    cardNumber: "**** **** **** 4242",
    cardHolder: "John Doe",
    expiryDate: "05/26",
    cvv: "***",
    isDefault: true,
  },
  {
    id: 2,
    cardType: "Mastercard",
    cardNumber: "**** **** **** 5555",
    cardHolder: "John Doe",
    expiryDate: "09/25",
    cvv: "***",
    isDefault: false,
  },
];

const PaymentSection: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] =
    useState<PaymentMethod[]>(mockPaymentMethods);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<PaymentMethod | null>(
    null
  );

  const handleAddPayment = (data: PaymentFormValues) => {
    const newPayment: PaymentMethod = {
      id: paymentMethods.length + 1,
      cardType: data.cardType,
      cardNumber: maskCardNumber(data.cardNumber),
      cardHolder: data.cardHolder,
      expiryDate: data.expiryDate,
      cvv: "***",
      isDefault: false,
    };

    setPaymentMethods([...paymentMethods, newPayment]);
    setIsAddDialogOpen(false);

    toast({
      title: t("payment.methodAdded"),
      description: t("payment.methodAddedDesc"),
    });
  };

  const handleEditPayment = (data: PaymentFormValues) => {
    if (!currentPayment) return;

    const updatedPaymentMethods = paymentMethods.map((payment) =>
      payment.id === currentPayment.id
        ? {
            ...payment,
            cardType: data.cardType,
            cardNumber: maskCardNumber(data.cardNumber),
            cardHolder: data.cardHolder,
            expiryDate: data.expiryDate,
          }
        : payment
    );

    setPaymentMethods(updatedPaymentMethods);
    setIsEditDialogOpen(false);
    setCurrentPayment(null);

    toast({
      title: t("payment.methodUpdated"),
      description: t("payment.methodUpdatedDesc"),
    });
  };

  const handleDeletePayment = (id: number) => {
    const updatedPaymentMethods = paymentMethods.filter(
      (payment) => payment.id !== id
    );
    setPaymentMethods(updatedPaymentMethods);

    toast({
      title: t("payment.methodDeleted"),
      description: t("payment.methodDeletedDesc"),
    });
  };

  const openEditDialog = (payment: PaymentMethod) => {
    setCurrentPayment(payment);
    setIsEditDialogOpen(true);
  };

  const setDefaultPayment = (id: number) => {
    const updatedPaymentMethods = paymentMethods.map((payment) => ({
      ...payment,
      isDefault: payment.id === id,
    }));

    setPaymentMethods(updatedPaymentMethods);

    toast({
      title: t("payment.defaultUpdated"),
      description: t("payment.defaultUpdatedDesc"),
    });
  };

  const maskCardNumber = (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\s+/g, "");
    return `**** **** **** ${cleaned.slice(-4)}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{t("profile.payment")}</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("payment.addNew")}
        </Button>
      </div>

      <div className="space-y-4">
        {paymentMethods.map((payment) => (
          <div
            key={payment.id}
            className="border rounded-lg p-4 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-3 text-gray-500 dark:text-gray-400">
                  <CreditCard size={18} />
                </div>
                <div>
                  <h3 className="font-medium">
                    {payment.cardType}
                    {payment.isDefault && (
                      <span className="ml-2 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full">
                        {t("payment.default")}
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {payment.cardNumber}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {payment.cardHolder}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t("payment.expires")}: {payment.expiryDate}
                  </p>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(payment)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeletePayment(payment.id)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
                {!payment.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDefaultPayment(payment.id)}
                    className="text-xs"
                  >
                    {t("payment.makeDefault")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {paymentMethods.length === 0 && (
          <div className="text-center py-8 border rounded-md dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              {t("payment.noMethods")}
            </p>
          </div>
        )}
      </div>

      {/* Add Payment Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("payment.addNew")}</DialogTitle>
          </DialogHeader>
          <PaymentForm
            onSubmit={handleAddPayment}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Payment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("payment.editMethod")}</DialogTitle>
          </DialogHeader>
          {currentPayment && (
            <PaymentForm
              onSubmit={handleEditPayment}
              onCancel={() => setIsEditDialogOpen(false)}
              defaultValues={currentPayment}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentSection;
