/**
 * Cash on Delivery (COD) Payment Provider
 * Simple payment provider for manual cash payments
 */

import {
  IPaymentProvider,
  PaymentRequest,
  PaymentResponse,
  PaymentVerification,
  PaymentStatus,
} from "../types";

export class CODPaymentProvider implements IPaymentProvider {
  name = "Cash on Delivery";

  /**
   * COD doesn't require online payment, just creates a pending order
   */
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Generate a unique payment ID for COD orders
      const paymentId = `COD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      return {
        success: true,
        paymentId,
        transactionId: paymentId,
        status: PaymentStatus.PENDING,
        message: "Order placed successfully. Pay cash on delivery.",
        metadata: {
          orderId: request.orderId,
          amount: request.amount,
          currency: request.currency,
        },
      };
    } catch (error) {
      console.error("COD payment creation failed:", error);
      return {
        success: false,
        status: PaymentStatus.FAILED,
        error: "Failed to create COD order",
      };
    }
  }

  /**
   * Verify COD payment (manual verification by admin)
   */
  async verifyPayment(
    paymentId: string,
    metadata?: Record<string, any>
  ): Promise<PaymentVerification> {
    // COD payments are always pending until manually verified
    // This would typically check your database for admin verification
    return {
      success: true,
      paymentId,
      status: PaymentStatus.PENDING,
      metadata: {
        message: "COD payment pending verification",
      },
    };
  }

  /**
   * Cancel COD order
   */
  async cancelPayment(paymentId: string): Promise<PaymentResponse> {
    return {
      success: true,
      paymentId,
      status: PaymentStatus.CANCELLED,
      message: "COD order cancelled successfully",
    };
  }

  /**
   * COD is always available
   */
  isAvailable(): boolean {
    return true;
  }
}
