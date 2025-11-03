/**
 * Cashfree Payment Provider
 * Integration with Cashfree payment gateway for Indian market
 */

import {
  IPaymentProvider,
  PaymentRequest,
  PaymentResponse,
  PaymentVerification,
  PaymentStatus,
} from "../types";

interface CashfreeConfig {
  appId: string;
  secretKey: string;
  env: "TEST" | "PROD";
}

export class CashfreePaymentProvider implements IPaymentProvider {
  name = "Cashfree";
  private config: CashfreeConfig;
  private baseUrl: string;

  constructor() {
    this.config = {
      appId: process.env.CASHFREE_APP_ID || "",
      secretKey: process.env.CASHFREE_SECRET_KEY || "",
      env: (process.env.CASHFREE_ENV as "TEST" | "PROD") || "TEST",
    };

    this.baseUrl =
      this.config.env === "PROD"
        ? "https://api.cashfree.com"
        : "https://sandbox.cashfree.com";
  }

  /**
   * Create a payment order with Cashfree
   */
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (!this.isAvailable()) {
        throw new Error("Cashfree is not configured");
      }

      // Cashfree API endpoint for creating orders
      const endpoint = `${this.baseUrl}/pg/orders`;

      const orderData = {
        order_id: request.orderId,
        order_amount: request.amount,
        order_currency: request.currency,
        customer_details: {
          customer_id: request.customerEmail.replace(/[^a-zA-Z0-9]/g, "_"),
          customer_name: request.customerName,
          customer_email: request.customerEmail,
          customer_phone: request.customerPhone,
        },
        order_meta: {
          return_url: request.returnUrl || `${process.env.NEXT_PUBLIC_API_URL}/api/payment/callback`,
          notify_url: `${process.env.NEXT_PUBLIC_API_URL}/api/payment/webhook/cashfree`,
        },
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": this.config.appId,
          "x-client-secret": this.config.secretKey,
          "x-api-version": "2023-08-01",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok || !data.payment_session_id) {
        throw new Error(data.message || "Failed to create Cashfree order");
      }

      return {
        success: true,
        paymentId: data.order_id,
        transactionId: data.payment_session_id,
        status: PaymentStatus.PENDING,
        paymentUrl: data.payment_link || this.getPaymentUrl(data.payment_session_id),
        message: "Payment session created successfully",
        metadata: {
          sessionId: data.payment_session_id,
          orderId: data.order_id,
        },
      };
    } catch (error: any) {
      console.error("Cashfree payment creation failed:", error);
      return {
        success: false,
        status: PaymentStatus.FAILED,
        error: error.message || "Failed to create Cashfree payment",
      };
    }
  }

  /**
   * Verify a Cashfree payment
   */
  async verifyPayment(
    orderId: string,
    metadata?: Record<string, any>
  ): Promise<PaymentVerification> {
    try {
      if (!this.isAvailable()) {
        throw new Error("Cashfree is not configured");
      }

      const endpoint = `${this.baseUrl}/pg/orders/${orderId}`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": this.config.appId,
          "x-client-secret": this.config.secretKey,
          "x-api-version": "2023-08-01",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to verify payment");
      }

      // Map Cashfree status to our PaymentStatus
      let status: PaymentStatus;
      switch (data.order_status) {
        case "PAID":
          status = PaymentStatus.SUCCESS;
          break;
        case "ACTIVE":
          status = PaymentStatus.PENDING;
          break;
        case "EXPIRED":
        case "TERMINATED":
          status = PaymentStatus.CANCELLED;
          break;
        default:
          status = PaymentStatus.FAILED;
      }

      return {
        success: data.order_status === "PAID",
        paymentId: data.order_id,
        status,
        amount: data.order_amount,
        metadata: {
          transactionId: data.cf_order_id,
          paymentMethod: data.payment_method,
          paymentTime: data.payment_completion_time,
        },
      };
    } catch (error: any) {
      console.error("Cashfree payment verification failed:", error);
      return {
        success: false,
        paymentId: orderId,
        status: PaymentStatus.FAILED,
        metadata: {
          error: error.message,
        },
      };
    }
  }

  /**
   * Cancel/Refund a Cashfree payment
   */
  async cancelPayment(orderId: string): Promise<PaymentResponse> {
    try {
      if (!this.isAvailable()) {
        throw new Error("Cashfree is not configured");
      }

      // Note: Cashfree refunds require a separate refund API call
      // This is a simplified implementation
      const endpoint = `${this.baseUrl}/pg/orders/${orderId}/refunds`;

      const refundData = {
        refund_amount: 0, // You would need to pass the actual amount
        refund_id: `refund-${Date.now()}`,
        refund_note: "Order cancelled by customer",
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": this.config.appId,
          "x-client-secret": this.config.secretKey,
          "x-api-version": "2023-08-01",
        },
        body: JSON.stringify(refundData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel payment");
      }

      return {
        success: true,
        paymentId: orderId,
        status: PaymentStatus.CANCELLED,
        message: "Payment cancelled and refund initiated",
      };
    } catch (error: any) {
      console.error("Cashfree payment cancellation failed:", error);
      return {
        success: false,
        paymentId: orderId,
        status: PaymentStatus.FAILED,
        error: error.message || "Failed to cancel payment",
      };
    }
  }

  /**
   * Check if Cashfree is properly configured
   */
  isAvailable(): boolean {
    return Boolean(this.config.appId && this.config.secretKey);
  }

  /**
   * Get payment URL for redirect
   */
  private getPaymentUrl(sessionId: string): string {
    return `${this.baseUrl}/pg/view/order/${sessionId}`;
  }
}
