/**
 * Payment system types and interfaces
 */

export enum PaymentMethod {
  COD = "cod",
  CASHFREE = "cashfree",
  STRIPE = "stripe", // For future use
}

export enum PaymentStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export interface PaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  returnUrl?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  transactionId?: string;
  status: PaymentStatus;
  paymentUrl?: string; // For redirect-based payments
  message?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export interface PaymentVerification {
  success: boolean;
  paymentId: string;
  status: PaymentStatus;
  amount?: number;
  metadata?: Record<string, any>;
}

/**
 * Abstract payment provider interface
 * All payment providers must implement this interface
 */
export interface IPaymentProvider {
  name: string;

  /**
   * Initialize a payment
   */
  createPayment(request: PaymentRequest): Promise<PaymentResponse>;

  /**
   * Verify a payment
   */
  verifyPayment(paymentId: string, metadata?: Record<string, any>): Promise<PaymentVerification>;

  /**
   * Cancel/Refund a payment
   */
  cancelPayment?(paymentId: string): Promise<PaymentResponse>;

  /**
   * Check if provider is available/configured
   */
  isAvailable(): boolean;
}
