"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Loader2, CheckCircle2, XCircle, Copy, Smartphone, QrCode } from "lucide-react";
import axios from "axios";
import QRCode from "qrcode";

interface UPIPaymentProps {
  orderId: string;
  paymentId: string;
  amount: number;
  qrString?: string;
  upiString?: string;
  intentUrl?: string;
  onSuccess: () => void;
  onFailure: () => void;
  onCancel: () => void;
}

type PaymentState = "pending" | "polling" | "success" | "failed" | "expired";

export function UPIPayment({
  orderId,
  paymentId,
  amount,
  qrString,
  upiString,
  intentUrl,
  onSuccess,
  onFailure,
  onCancel,
}: UPIPaymentProps) {
  const [paymentState, setPaymentState] = useState<PaymentState>("pending");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const MAX_POLLS = 60; // 5 minutes with 5-second intervals

  // Generate QR code image from UPI string
  useEffect(() => {
    const generateQR = async () => {
      const upiData = upiString || qrString;
      if (upiData) {
        try {
          const dataUrl = await QRCode.toDataURL(upiData, {
            width: 250,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#ffffff",
            },
          });
          setQrCodeDataUrl(dataUrl);
        } catch (err) {
          console.error("QR generation error:", err);
        }
      }
    };
    generateQR();
  }, [qrString, upiString]);

  // Poll for payment status
  const checkPaymentStatus = useCallback(async () => {
    try {
      const response = await axios.post("/api/payment/verify", {
        orderId,
      });

      const { paymentStatus } = response.data;

      if (paymentStatus === "success") {
        setPaymentState("success");
        toast.success("Payment successful!");
        setTimeout(onSuccess, 1500);
        return true;
      } else if (paymentStatus === "failed") {
        setPaymentState("failed");
        toast.error("Payment failed");
        return true;
      } else if (paymentStatus === "cancelled") {
        setPaymentState("expired");
        toast.error("Payment expired or cancelled");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Payment status check failed:", error);
      return false;
    }
  }, [orderId, onSuccess]);

  // Start polling when component mounts
  useEffect(() => {
    if (paymentState !== "pending" && paymentState !== "polling") return;

    setPaymentState("polling");
    let pollInterval: NodeJS.Timeout;

    // Delay first poll by 5 seconds to give user time to scan QR
    // and avoid premature status checks
    const initialDelay = setTimeout(async () => {
      const completed = await checkPaymentStatus();
      if (completed) return;

      // Start regular polling after initial check
      pollInterval = setInterval(async () => {
        setPollCount((prev) => {
          if (prev >= MAX_POLLS) {
            clearInterval(pollInterval);
            setPaymentState("expired");
            return prev;
          }
          return prev + 1;
        });

        const done = await checkPaymentStatus();
        if (done) {
          clearInterval(pollInterval);
        }
      }, 5000); // Poll every 5 seconds
    }, 5000);

    return () => {
      clearTimeout(initialDelay);
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [checkPaymentStatus, paymentState]);

  // Countdown timer - updates every second
  useEffect(() => {
    if (paymentState !== "polling") return;

    const countdownInterval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setPaymentState("expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [paymentState]);

  const copyUpiId = () => {
    const upiData = upiString || qrString;
    if (upiData) {
      navigator.clipboard.writeText(upiData);
      setCopied(true);
      toast.success("UPI ID copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openUpiApp = () => {
    const upiLink = intentUrl || upiString || qrString;
    if (upiLink) {
      window.location.href = upiLink;
    }
  };

  const formatAmount = (amt: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amt);
  };

  // Success state
  if (paymentState === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
        <h3 className="text-xl font-semibold text-green-700">Payment Successful!</h3>
        <p className="text-gray-600">Your order has been placed.</p>
      </div>
    );
  }

  // Failed state
  if (paymentState === "failed") {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <XCircle className="h-16 w-16 text-red-500" />
        <h3 className="text-xl font-semibold text-red-700">Payment Failed</h3>
        <p className="text-gray-600">Please try again or choose a different payment method.</p>
        <Button onClick={onFailure} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  // Expired state
  if (paymentState === "expired") {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <XCircle className="h-16 w-16 text-orange-500" />
        <h3 className="text-xl font-semibold text-orange-700">Payment Expired</h3>
        <p className="text-gray-600">The QR code has expired. Please try again.</p>
        <Button onClick={onFailure} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  // Pending/Polling state - Show QR
  return (
    <div className="flex flex-col items-center space-y-6 py-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Pay {formatAmount(amount)}</h3>
        <p className="text-sm text-gray-500 mt-1">Scan QR code with any UPI app</p>
      </div>

      {/* QR Code */}
      <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
        {qrCodeDataUrl ? (
          <img src={qrCodeDataUrl} alt="UPI QR Code" className="w-[250px] h-[250px]" />
        ) : (
          <div className="w-[250px] h-[250px] flex items-center justify-center bg-gray-100 rounded">
            <QrCode className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>

      {/* UPI Apps logos placeholder */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>GPay</span>
        <span>•</span>
        <span>PhonePe</span>
        <span>•</span>
        <span>Paytm</span>
        <span>•</span>
        <span>BHIM</span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Button
          variant="outline"
          className="flex-1"
          onClick={copyUpiId}
          disabled={!upiString && !qrString}
        >
          {copied ? (
            <CheckCircle2 className="h-4 w-4 mr-2" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          {copied ? "Copied!" : "Copy UPI"}
        </Button>

        <Button
          className="flex-1"
          onClick={openUpiApp}
          disabled={!intentUrl && !upiString}
        >
          <Smartphone className="h-4 w-4 mr-2" />
          Open UPI App
        </Button>
      </div>

      {/* Polling indicator */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Waiting for payment confirmation...</span>
      </div>

      {/* Timer */}
      <p className="text-xs text-gray-400">
        QR valid for {Math.floor(timeRemaining / 60)} min {timeRemaining % 60} sec
      </p>

      {/* Cancel button */}
      <Button variant="ghost" size="sm" onClick={onCancel} className="text-gray-500">
        Cancel and go back
      </Button>
    </div>
  );
}
