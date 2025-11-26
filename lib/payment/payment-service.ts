/**
 * Payment Service
 * Centralized service for handling all payment operations
 */

import {
  IPaymentProvider,
  PaymentMethod,
  PaymentRequest,
  PaymentResponse,
  PaymentVerification,
} from "./types";
import { CODPaymentProvider } from "./providers/cod-provider";
import { CashfreePaymentProvider } from "./providers/cashfree-provider";
import { SprintNxtPaymentProvider } from "./providers/sprintnxt-provider";

export class PaymentService {
  private providers: Map<PaymentMethod, IPaymentProvider>;
  private defaultProvider: PaymentMethod;

  constructor() {
    this.providers = new Map();
    this.initializeProviders();
    this.defaultProvider = PaymentMethod.COD;
  }

  /**
   * Initialize all payment providers
   */
  private initializeProviders() {
    // Register COD provider
    this.providers.set(PaymentMethod.COD, new CODPaymentProvider());

    // Register Cashfree provider
    this.providers.set(PaymentMethod.CASHFREE, new CashfreePaymentProvider());

    // Register SprintNxt UPI provider
    this.providers.set(PaymentMethod.SPRINTNXT, new SprintNxtPaymentProvider());

    // Add more providers here as needed
    // this.providers.set(PaymentMethod.STRIPE, new StripePaymentProvider());
  }

  /**
   * Get a payment provider by method
   */
  private getProvider(method: PaymentMethod): IPaymentProvider {
    const provider = this.providers.get(method);
    if (!provider) {
      throw new Error(`Payment provider for ${method} not found`);
    }
    return provider;
  }

  /**
   * Get all available payment methods
   */
  getAvailablePaymentMethods(): {
    method: PaymentMethod;
    name: string;
    available: boolean;
  }[] {
    const methods: {
      method: PaymentMethod;
      name: string;
      available: boolean;
    }[] = [];

    this.providers.forEach((provider, method) => {
      methods.push({
        method,
        name: provider.name,
        available: provider.isAvailable(),
      });
    });

    return methods;
  }

  /**
   * Create a payment
   */
  async createPayment(
    method: PaymentMethod,
    request: PaymentRequest
  ): Promise<PaymentResponse> {
    try {
      const provider = this.getProvider(method);

      if (!provider.isAvailable()) {
        return {
          success: false,
          status: "failed" as any,
          error: `${provider.name} is not available or not configured`,
        };
      }

      return await provider.createPayment(request);
    } catch (error: any) {
      console.error(`Payment creation failed for ${method}:`, error);
      return {
        success: false,
        status: "failed" as any,
        error: error.message || "Payment creation failed",
      };
    }
  }

  /**
   * Verify a payment
   */
  async verifyPayment(
    method: PaymentMethod,
    paymentId: string,
    metadata?: Record<string, any>
  ): Promise<PaymentVerification> {
    try {
      const provider = this.getProvider(method);
      return await provider.verifyPayment(paymentId, metadata);
    } catch (error: any) {
      console.error(`Payment verification failed for ${method}:`, error);
      return {
        success: false,
        paymentId,
        status: "failed" as any,
        metadata: {
          error: error.message,
        },
      };
    }
  }

  /**
   * Cancel a payment
   */
  async cancelPayment(
    method: PaymentMethod,
    paymentId: string
  ): Promise<PaymentResponse> {
    try {
      const provider = this.getProvider(method);

      if (!provider.cancelPayment) {
        return {
          success: false,
          status: "failed" as any,
          error: `${provider.name} does not support cancellation`,
        };
      }

      return await provider.cancelPayment(paymentId);
    } catch (error: any) {
      console.error(`Payment cancellation failed for ${method}:`, error);
      return {
        success: false,
        paymentId,
        status: "failed" as any,
        error: error.message || "Payment cancellation failed",
      };
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
