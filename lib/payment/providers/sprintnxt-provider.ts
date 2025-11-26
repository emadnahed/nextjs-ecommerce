/**
 * SprintNxt Payment Provider
 * Integration with SprintNxt UPI payment gateway
 */

import {
  IPaymentProvider,
  PaymentRequest,
  PaymentResponse,
  PaymentVerification,
  PaymentStatus,
} from "../types";
import crypto from "crypto";

interface SprintNxtConfig {
  clientId: string;
  clientSecret: string;
  encryptionKey: string;
  encryptionIV: string;
  env: "UAT" | "PROD";
}

// SprintNxt transaction status codes
enum SprintNxtTxnStatus {
  SUCCESS = 1,
  INITIATED = 2,
  QR_GENERATED = 3,
  QR_EXPIRED = 4,
  FAILED = 5,
  PENDING = 6,
}

// API IDs for SprintNxt services
enum SprintNxtApiId {
  BANK_ACCOUNT_LIST = 20242,
  VALIDATE_VPA = 20243,
  GET_VPA = 20246,
  GET_TXN_STATUS = 20247,
  DYNAMIC_QR = 20260,
  STATIC_QR = 20249,
}

export class SprintNxtPaymentProvider implements IPaymentProvider {
  name = "SprintNxt UPI";
  private config: SprintNxtConfig;
  private baseUrl: string;

  constructor() {
    this.config = {
      clientId: process.env.SPRINTNXT_CLIENT_ID || "",
      clientSecret: process.env.SPRINTNXT_CLIENT_SECRET || "",
      encryptionKey: process.env.SPRINTNXT_ENCRYPTION_KEY || "",
      encryptionIV: process.env.SPRINTNXT_ENCRYPTION_IV || "",
      env: (process.env.SPRINTNXT_ENV as "UAT" | "PROD") || "UAT",
    };

    this.baseUrl =
      this.config.env === "PROD"
        ? "https://api.sprintnxt.in/api/v2/UPIService/UPI"
        : "https://nxt-nonprod.sprintnxt.in/NonProdNextgenAPIExpose/api/v2/UPIService/UPI";
  }

  /**
   * Encrypt data using AES-256-CBC
   */
  private encrypt(data: string): string {
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(this.config.encryptionKey, "utf8"),
      Buffer.from(this.config.encryptionIV, "utf8")
    );
    let encrypted = cipher.update(data, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
  }

  /**
   * Decrypt data using AES-256-CBC
   */
  private decrypt(encryptedData: string): string {
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(this.config.encryptionKey, "utf8"),
      Buffer.from(this.config.encryptionIV, "utf8")
    );
    let decrypted = decipher.update(encryptedData, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  /**
   * Generate authentication token for API requests
   */
  private generateAuthToken(): string {
    const tokenPayload = {
      client_secret: this.config.clientSecret,
      requestid: this.generateRequestId(),
      timestamp: Math.floor(Date.now() / 1000).toString(),
    };
    console.log("[SprintNxt] Token payload:", JSON.stringify(tokenPayload, null, 2));
    const encrypted = this.encrypt(JSON.stringify(tokenPayload));
    console.log("[SprintNxt] Encrypted token length:", encrypted.length);
    return encrypted;
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `REQ${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }

  /**
   * Generate unique reference ID for transactions
   */
  private generateReferenceId(): string {
    return `TXN${Date.now()}${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  }

  /**
   * Make API request to SprintNxt
   */
  private async makeRequest(payload: Record<string, any>): Promise<any> {
    const authToken = this.generateAuthToken();
    const clientIdBase64 = Buffer.from(this.config.clientId).toString("base64");

    console.log("[SprintNxt] Making request to:", this.baseUrl);
    console.log("[SprintNxt] Client ID:", this.config.clientId);
    console.log("[SprintNxt] Client ID (Base64):", clientIdBase64);
    console.log("[SprintNxt] Auth Token (first 50 chars):", authToken.substring(0, 50) + "...");
    console.log("[SprintNxt] Payload:", JSON.stringify(payload, null, 2));

    // Use Base64-encoded Client-Id as per SprintNxt documentation
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": clientIdBase64,
        "Token": authToken,
      },
      body: JSON.stringify(payload),
    });

    console.log("[SprintNxt] Response status:", response.status);
    console.log("[SprintNxt] Response headers:", Object.fromEntries(response.headers.entries()));

    // Get response as text first to handle non-JSON responses
    const responseText = await response.text();
    console.log("[SprintNxt] Response text (first 500 chars):", responseText.substring(0, 500));

    // Try to parse as JSON
    try {
      const data = JSON.parse(responseText);
      console.log("[SprintNxt] Parsed response:", JSON.stringify(data, null, 2));
      return data;
    } catch (e) {
      console.error("[SprintNxt] Failed to parse JSON, raw response:", responseText.substring(0, 1000));
      return {
        status: false,
        status_code: response.status,
        message: `Server returned non-JSON response (HTTP ${response.status})`,
        rawResponse: responseText.substring(0, 500),
      };
    }
  }

  /**
   * Validate a VPA (UPI ID) before initiating payment
   */
  async validateVPA(vpaAddress: string): Promise<{
    valid: boolean;
    accountHolderName?: string;
    error?: string;
  }> {
    try {
      if (!this.isAvailable()) {
        throw new Error("SprintNxt is not configured");
      }

      const payload = {
        apiid: SprintNxtApiId.VALIDATE_VPA,
        vpaaddress: vpaAddress,
        referenceid: this.generateReferenceId(),
      };

      const response = await this.makeRequest(payload);

      if (response.returnCode === "0" || response.returnCode === 0) {
        return {
          valid: true,
          accountHolderName: response.accountHolderName || response.name,
        };
      }

      return {
        valid: false,
        error: response.responseMessage || "Invalid VPA",
      };
    } catch (error: any) {
      console.error("SprintNxt VPA validation failed:", error);
      return {
        valid: false,
        error: error.message || "VPA validation failed",
      };
    }
  }

  /**
   * Create a Dynamic QR code payment
   */
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (!this.isAvailable()) {
        throw new Error("SprintNxt is not configured");
      }

      const referenceId = this.generateReferenceId();
      const callbackUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/payment/webhook/sprintnxt`;

      // Use referenceId as txnReferance so verifyPayment can use paymentId for both
      // txnReferance must be <= 35 chars (referenceId is ~24 chars)
      const payload = {
        apiId: "20260",
        referenceid: referenceId,
        payeeVPA: "sprintnxt.8080@jiomerchant",
        amount: "10",
        remarks: `Order ${request.orderId}`,
        mobile: request.customerPhone.replace(/\D/g, '').slice(-10), // Ensure 10-digit number
        email: request.customerEmail,
        bankId: 12,
        txnNote: 'test transaction',
        txnReferance: referenceId, // Same as referenceid for easier verification lookup
      };

      const response = await this.makeRequest(payload);

      // SprintNxt API returns success with status: true and responsecode: 1
      // Data is nested under 'details' object
      const isSuccess = response.status === true || response.responsecode === 1 ||
                        response.returnCode === "0" || response.returnCode === 0;

      if (isSuccess) {
        // Extract data from details object (new format) or root level (legacy)
        const details = response.details || response;
        const intentUrl = details.intent_url || details.intentUrl || response.intentUrl;
        const qrString = details.qrString || response.qrString;
        const upiString = details.upiString || response.upiString || intentUrl;

        return {
          success: true,
          paymentId: referenceId,
          transactionId: details.txnReferance || details.UPIRefID || response.transactionId || response.txnId,
          status: PaymentStatus.PENDING,
          paymentUrl: intentUrl || qrString,
          message: response.message || "QR code generated successfully",
          metadata: {
            referenceId,
            qrString: qrString || intentUrl, // Use intent_url as QR string if no separate qrString
            intentUrl: intentUrl,
            upiString: upiString,
            orderId: request.orderId,
            payeeVPA: details.payeeVPA,
            merchantId: details.merchantId,
          },
        };
      }

      return {
        success: false,
        status: PaymentStatus.FAILED,
        error: response.message || response.responseMessage || "Failed to create payment",
        metadata: {
          returnCode: response.returnCode || response.responsecode,
          responseMessage: response.message || response.responseMessage,
          statusCode: response.status_code,
        },
      };
    } catch (error: any) {
      console.error("SprintNxt payment creation failed:", error);
      return {
        success: false,
        status: PaymentStatus.FAILED,
        error: error.message || "Failed to create SprintNxt payment",
      };
    }
  }

  /**
   * Get transaction status
   */
  async verifyPayment(
    referenceId: string,
    metadata?: Record<string, any>
  ): Promise<PaymentVerification> {
    try {
      if (!this.isAvailable()) {
        throw new Error("SprintNxt is not configured");
      }

      // SprintNxt requires bankId and txnId for status check
      // Since createPayment uses referenceId as txnReferance, we use the same value here
      const payload = {
        apiId: "20247", // GET_TXN_STATUS as string
        referenceid: referenceId,
        bankId: 12, // Same bankId used in createPayment
        txnId: referenceId, // Same as referenceid (txnReferance = referenceId in createPayment)
      };

      const response = await this.makeRequest(payload);

      // Extract data from details object (new format) or root level (legacy)
      const details = response.details || response;

      // Map SprintNxt status to PaymentStatus
      // Handle both numeric and string status values
      let status: PaymentStatus;
      const rawStatus = details.txnStatus || details.status || response.txnStatus || response.status;
      const txnStatus = typeof rawStatus === 'number' ? rawStatus : parseInt(rawStatus);

      // If status is undefined/NaN, treat as PENDING (still waiting for payment)
      if (rawStatus === undefined || rawStatus === null || isNaN(txnStatus)) {
        console.log("[SprintNxt] No status returned, treating as PENDING");
        status = PaymentStatus.PENDING;
      } else {
        switch (txnStatus) {
          case SprintNxtTxnStatus.SUCCESS:
            status = PaymentStatus.SUCCESS;
            break;
          case SprintNxtTxnStatus.INITIATED:
          case SprintNxtTxnStatus.QR_GENERATED:
          case SprintNxtTxnStatus.PENDING:
            status = PaymentStatus.PENDING;
            break;
          case SprintNxtTxnStatus.QR_EXPIRED:
            status = PaymentStatus.CANCELLED;
            break;
          case SprintNxtTxnStatus.FAILED:
            status = PaymentStatus.FAILED;
            break;
          default:
            // Unknown status - treat as PENDING rather than FAILED
            // to avoid prematurely marking payments as failed
            console.log("[SprintNxt] Unknown txnStatus:", txnStatus, "treating as PENDING");
            status = PaymentStatus.PENDING;
        }
      }

      return {
        success: txnStatus === SprintNxtTxnStatus.SUCCESS,
        paymentId: referenceId,
        status,
        amount: parseFloat(details.amount || response.amount) || metadata?.amount,
        metadata: {
          transactionId: details.transactionId || details.txnId || response.transactionId || response.txnId,
          upiTxnId: details.upiTxnId || response.upiTxnId,
          payerVpa: details.payerVpa || response.payerVpa,
          payeeVpa: details.payeeVpa || response.payeeVpa,
          txnStatus: rawStatus,
          responseMessage: response.message || details.responseMessage || response.responseMessage,
        },
      };
    } catch (error: any) {
      console.error("SprintNxt payment verification failed:", error);
      // Return PENDING on errors to avoid prematurely failing payments
      // The next poll will try again
      return {
        success: false,
        paymentId: referenceId,
        status: PaymentStatus.PENDING,
        metadata: {
          error: error.message,
          retryable: true,
        },
      };
    }
  }

  /**
   * Process webhook callback from SprintNxt
   * Callbacks come with encrypted data in 'encdata' field
   */
  async processCallback(encryptedData: string): Promise<{
    success: boolean;
    referenceId?: string;
    status: PaymentStatus;
    data?: Record<string, any>;
    error?: string;
  }> {
    try {
      const decryptedData = this.decrypt(encryptedData);
      const callbackData = JSON.parse(decryptedData);

      const txnStatus = parseInt(callbackData.txnStatus || callbackData.status);
      let status: PaymentStatus;

      switch (txnStatus) {
        case SprintNxtTxnStatus.SUCCESS:
          status = PaymentStatus.SUCCESS;
          break;
        case SprintNxtTxnStatus.INITIATED:
        case SprintNxtTxnStatus.QR_GENERATED:
        case SprintNxtTxnStatus.PENDING:
          status = PaymentStatus.PENDING;
          break;
        case SprintNxtTxnStatus.QR_EXPIRED:
          status = PaymentStatus.CANCELLED;
          break;
        case SprintNxtTxnStatus.FAILED:
        default:
          status = PaymentStatus.FAILED;
      }

      return {
        success: txnStatus === SprintNxtTxnStatus.SUCCESS,
        referenceId: callbackData.referenceid || callbackData.referenceId,
        status,
        data: callbackData,
      };
    } catch (error: any) {
      console.error("SprintNxt callback processing failed:", error);
      return {
        success: false,
        status: PaymentStatus.FAILED,
        error: error.message || "Failed to process callback",
      };
    }
  }

  /**
   * Generate Static QR code (for fixed amount collections)
   */
  async generateStaticQR(params: {
    amount?: number;
    remarks?: string;
    name: string;
  }): Promise<{
    success: boolean;
    qrString?: string;
    error?: string;
  }> {
    try {
      if (!this.isAvailable()) {
        throw new Error("SprintNxt is not configured");
      }

      const payload = {
        apiid: SprintNxtApiId.STATIC_QR,
        referenceid: this.generateReferenceId(),
        amount: params.amount?.toString() || "",
        remarks: params.remarks || "",
        name: params.name,
      };

      const response = await this.makeRequest(payload);

      if (response.returnCode === "0" || response.returnCode === 0) {
        return {
          success: true,
          qrString: response.qrString,
        };
      }

      return {
        success: false,
        error: response.responseMessage || "Failed to generate QR",
      };
    } catch (error: any) {
      console.error("SprintNxt static QR generation failed:", error);
      return {
        success: false,
        error: error.message || "Failed to generate static QR",
      };
    }
  }

  /**
   * Check if SprintNxt is properly configured
   */
  isAvailable(): boolean {
    return Boolean(
      this.config.clientId &&
        this.config.clientSecret &&
        this.config.encryptionKey &&
        this.config.encryptionIV
    );
  }
}
