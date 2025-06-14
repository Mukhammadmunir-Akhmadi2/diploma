
import React from 'react';
import { useLanguage } from "../../contexts/LanguageContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";

interface PaymentFormProps {
  onSubmit: (data: PaymentFormValues) => void;
  onCancel: () => void;
  defaultValues?: Partial<PaymentFormValues>;
}

export interface PaymentFormValues {
  cardType: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

const paymentFormSchema = z.object({
  cardType: z.string().min(1, "Card type is required"),
  cardNumber: z.string().min(1, "Card number is required"),
  cardHolder: z.string().min(1, "Card holder name is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  cvv: z.string().min(3, "CVV is required").max(4),
});

const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit, onCancel, defaultValues }) => {
  const { t } = useLanguage();
  
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: defaultValues || {
      cardType: '',
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: ''
    },
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="cardType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('payment.cardType')}</FormLabel>
              <FormControl>
                <Input placeholder="Visa, Mastercard, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('payment.cardNumber')}</FormLabel>
              <FormControl>
                <Input placeholder="**** **** **** ****" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="cardHolder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('payment.cardHolder')}</FormLabel>
              <FormControl>
                <Input placeholder="Name on card" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('payment.expiryDate')}</FormLabel>
                <FormControl>
                  <Input placeholder="MM/YY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cvv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('payment.cvv')}</FormLabel>
                <FormControl>
                  <Input placeholder="***" type="password" maxLength={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          <Button type="submit">
            {t('common.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PaymentForm;
