"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import useCart from "@/hooks/use-cart";
import axios from "axios";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email({ message: "Please enter a valid email" }),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  paymentMethod: z.enum(["cod", "cashfree"], "Please select a payment method"),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof formSchema>;

interface CheckoutFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

export function CheckoutForm({ onSuccess, onBack }: CheckoutFormProps) {
  const [loading, setLoading] = useState(false);
  const { items, removeAllCart } = useCart();
  const router = useRouter();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      address: "",
      paymentMethod: "cashfree",
      notes: "",
    },
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/checkout`,
        {
          ...data,
          items,
        }
      );

      if (response.data.paymentUrl) {
        // For online payments, redirect to payment URL
        window.location.href = response.data.paymentUrl;
      } else {
        // For COD
        toast.success("Order placed successfully!");
        removeAllCart();
        onSuccess();
        router.push("/order-confirmation");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(
        error.response?.data?.error || "Failed to process checkout. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="customerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="pt-4">
            <h3 className="text-lg font-medium">Shipping Address</h3>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Full Address *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="123 Main St, Apt 4B, City, State, ZIP Code"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="pt-4">
            <h3 className="text-lg font-medium">Payment Method</h3>
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3 mt-4">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="cashfree" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Pay Online (Credit/Debit Card, UPI, Net Banking)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="cod" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Cash on Delivery (COD)
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any special instructions for delivery"
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={loading}
          >
            Back to Cart
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Place Order"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
