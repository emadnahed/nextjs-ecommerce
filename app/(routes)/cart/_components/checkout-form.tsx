"use client";

import { useState, useEffect } from "react";
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
import { Loader2, Check } from "lucide-react";
import useCart from "@/hooks/use-cart";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UPIPayment } from "./upi-payment";

const formSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email({ message: "Please enter a valid email" }),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  pincode: z.string().min(6, "Pincode must be 6 digits").max(6, "Pincode must be 6 digits"),
  postOffice: z.object({
    name: z.string(),
    branchType: z.string(),
    deliveryStatus: z.string(),
    district: z.string(),
    state: z.string(),
    pincode: z.string()
  }).optional(),
  paymentMethod: z.enum(["cod", "cashfree", "sprintnxt"], "Please select a payment method"),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof formSchema>;

interface CheckoutFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

interface UPIPaymentData {
  orderId: string;
  paymentId: string;
  amount: number;
  qrString?: string;
  upiString?: string;
  intentUrl?: string;
}

export function CheckoutForm({ onSuccess, onBack }: CheckoutFormProps) {
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [postOffices, setPostOffices] = useState<any[]>([]);
  const [showPostOfficeList, setShowPostOfficeList] = useState(false);
  const [openInstructionsFor, setOpenInstructionsFor] = useState<string>("");
  const [upiPaymentData, setUpiPaymentData] = useState<UPIPaymentData | null>(null);
  const { items, removeAllCart } = useCart();
  const router = useRouter();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      address: "",
      pincode: "",
      postOffice: undefined,
      paymentMethod: "sprintnxt",
      notes: "",
    },
  });

  const fetchPostOffices = async (pincode: string) => {
    if (pincode.length !== 6) return;
    setPincodeLoading(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      if (data[0]?.Status === "Success" && data[0]?.PostOffice) {
        setPostOffices(data[0].PostOffice);
        setShowPostOfficeList(true);
      } else {
        setPostOffices([]);
        setShowPostOfficeList(false);
        form.setError("pincode", { type: "manual", message: "No post offices found for this pincode" });
      }
    } catch (error) {
      console.error("Error fetching post offices:", error);
      form.setError("pincode", { type: "manual", message: "Error fetching post office details" });
    } finally {
      setPincodeLoading(false);
    }
  };

  const selectPostOffice = (postOffice: any) => {
    form.setValue("postOffice", {
      name: postOffice.Name,
      branchType: postOffice.BranchType,
      deliveryStatus: postOffice.DeliveryStatus,
      district: postOffice.District,
      state: postOffice.State,
      pincode: postOffice.Pincode,
    });
  };

  const handlePincodeChange = (e: any) => {
    const value = String(e.target.value || "").replace(/\D/g, "").slice(0, 6);
    form.setValue("pincode", value);
    if (value.length === 6) {
      fetchPostOffices(value);
    } else {
      setPostOffices([]);
      setShowPostOfficeList(false);
      form.setValue("postOffice", undefined);
    }
  };

  const selectedPostOffice = form.watch("postOffice");
  const selectedValue = selectedPostOffice
    ? `${selectedPostOffice.name}|${selectedPostOffice.pincode}`
    : "";
  const customerName = form.watch("customerName");
  const customerPhone = form.watch("customerPhone");

  const safe = (v: any) => (typeof v === "string" ? v.trim() : "");
  const toUpper = (v: any) => safe(v).toUpperCase();
  const buildAddressLines = (po: any) => {
    const addr = safe(form.watch("address"));
    // Split user address by comma/newline into separate lines, trim empties
    const userLines = addr
      .split(/\n|,/)
      .map((l) => l.trim())
      .filter(Boolean);
    const district = toUpper(po?.District);
    const state = toUpper(po?.State);
    const pin = safe(po?.Pincode);
    const country = toUpper(po?.Country || "India");
    const locality = toUpper(po?.Name);
    // Compose lines like Amazon-style
    const lines: string[] = [
      ...userLines,
      locality,
      [district, state, pin].filter(Boolean).join(" "),
      country,
    ].filter(Boolean);
    return lines;
  };

  // For card rendering: use only PostOffice data so cards do not change when user edits inputs
  const buildPoLines = (po: any) => {
    const district = toUpper(po?.District);
    const state = toUpper(po?.State);
    const pin = safe(po?.Pincode);
    const country = toUpper(po?.Country || "India");
    const lines: string[] = [
      [district, state, pin].filter(Boolean).join(" "),
      country,
    ].filter(Boolean);
    return lines;
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!data.postOffice) {
      form.setError("pincode", { type: "manual", message: "Please select a post office" });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `/api/checkout`,
        {
          ...data,
          items,
        }
      );

      const { orderId, paymentUrl, metadata } = response.data;

      // Handle SprintNxt UPI payment - show QR code
      // Check for either qrString or intentUrl (SprintNxt returns intent_url which can be used for both QR and deep link)
      if (data.paymentMethod === "sprintnxt" && (metadata?.qrString || metadata?.intentUrl)) {
        // Use amount from backend metadata as single source of truth
        const totalAmount = metadata.amount;
        if (!totalAmount) {
          toast.error("Could not retrieve order amount. Please try again.");
          setLoading(false);
          return;
        }

        setUpiPaymentData({
          orderId,
          paymentId: metadata.referenceId || orderId,
          amount: totalAmount,
          qrString: metadata.qrString || metadata.intentUrl, // Use intentUrl for QR if no separate qrString
          upiString: metadata.upiString || metadata.intentUrl,
          intentUrl: metadata.intentUrl,
        });
        setLoading(false);
        return;
      }

      if (paymentUrl) {
        // For redirect-based payments (Cashfree)
        window.location.href = paymentUrl;
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

  const handleUPISuccess = () => {
    removeAllCart();
    onSuccess();
    router.push("/order-confirmation");
  };

  const handleUPIFailure = () => {
    setUpiPaymentData(null);
  };

  const handleUPICancel = () => {
    setUpiPaymentData(null);
  };

  // Show UPI payment screen if payment data is available
  if (upiPaymentData) {
    return (
      <UPIPayment
        orderId={upiPaymentData.orderId}
        paymentId={upiPaymentData.paymentId}
        amount={upiPaymentData.amount}
        qrString={upiPaymentData.qrString}
        upiString={upiPaymentData.upiString}
        intentUrl={upiPaymentData.intentUrl}
        onSuccess={handleUPISuccess}
        onFailure={handleUPIFailure}
        onCancel={handleUPICancel}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4 ">
          <h3 className="text-lg font-medium">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      className="!ring-0 !ring-offset-0 focus:!ring-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 outline-none focus:outline-none focus:border-foreground"
                      {...field}
                    />
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
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="!ring-0 !ring-offset-0 focus:!ring-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 outline-none focus:outline-none focus:border-foreground"
                      {...field}
                    />
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
                    <Input
                      type="tel"
                      placeholder="+91-XXXX-XXX-XXX"
                      className="!ring-0 !ring-offset-0 focus:!ring-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 outline-none focus:outline-none focus:border-foreground"
                      {...field}
                    />
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
                      placeholder="Enter your address here"
                      className="min-h-[100px] !ring-0 !ring-offset-0 focus:!ring-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 outline-none focus:outline-none focus:border-foreground"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Pincode *</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="Enter 6-digit pincode"
                        className="!ring-0 !ring-offset-0 focus:!ring-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 outline-none focus:outline-none focus:border-foreground"
                        {...field}
                        onChange={handlePincodeChange}
                        value={field.value}
                        inputMode="numeric"
                      />
                    </FormControl>
                    {pincodeLoading && (
                      <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-500" />
                    )}
                  </div>
                  <FormMessage />
                  {showPostOfficeList && (
                    <div className="mt-4 space-y-3 max-h-[600px] overflow-y-auto pr-1">
                      <RadioGroup
                        className="grid grid-cols-1 md:grid-cols-2 gap-3"
                        value={selectedValue}
                        onValueChange={(val) => {
                          const [name, pin] = val.split("|");
                          const po = postOffices.find((p: any) => p.Name === name && String(p.Pincode) === pin);
                          if (po) selectPostOffice(po);
                          setOpenInstructionsFor(val);
                        }}
                      >
                        {postOffices.length > 0 ? (
                          postOffices.map((po, index) => {
                            const value = `${po.Name}|${po.Pincode}`;
                            const inputId = `po-${index}`;
                            const isSelected = selectedValue === value;
                            const showInstructions = openInstructionsFor === value;
                            return (
                              <div key={index} className="relative">
                                <label
                                  className={`block relative p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                    isSelected
                                      ? "bg-emerald-50 border-emerald-500 shadow-md"
                                      : "bg-white border-gray-200 hover:border-gray-300 hover:shadow"
                                  }`}
                                  htmlFor={inputId}
                                >
                                  {/* Radio Button and Name Row */}
                                  <div className="flex items-start gap-3">
                                    <RadioGroupItem
                                      id={inputId}
                                      value={value}
                                      className="mt-0.5 shrink-0"
                                    />
                                    <div className="flex-1 min-w-0 pr-10">
                                      <h4 className="font-bold text-base leading-tight text-gray-900 mb-3 break-all overflow-wrap-anywhere">
                                        <div className="font-extrabold text-[13px] tracking-wide">
                                          {toUpper(po.Name)}
                                        </div>
                                        <div className="mt-2 space-y-1.5 leading-5">
                                          {buildPoLines(po).map((line, li) => (
                                            <div key={li} className="text-xs text-gray-800 break-words">{line}</div>
                                          ))}
                                        </div>
                                      </h4>
                                      {/* Intentionally not showing customer phone here to avoid card content changing based on inputs */}
                                    </div>

                                    {/* Checkmark Icon */}
                                    {isSelected && (
                                      <div className="absolute top-5 right-5">
                                        <div className="bg-emerald-500 rounded-full p-0.5">
                                          <Check className="h-4 w-4 text-white stroke-[3]" />
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                </label>
                              </div>
                            );
                          })
                        ) : (
                          <div className="col-span-full p-6 text-center text-sm text-gray-500 bg-gray-50 rounded-lg">
                            No post offices found for this pincode
                          </div>
                        )}
                      </RadioGroup>
                    </div>
                  )}
                  
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
                          <RadioGroupItem value="sprintnxt" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          UPI (Pay via QR Code / UPI Apps)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="cashfree" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Pay Online (Credit/Debit Card, Net Banking)
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
                    className="min-h-[80px] !ring-0 !ring-offset-0 focus:!ring-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 outline-none focus:outline-none focus:border-foreground"
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
