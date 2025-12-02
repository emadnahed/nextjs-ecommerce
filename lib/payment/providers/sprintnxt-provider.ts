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
  partnerKey: string;
  env: "UAT" | "PROD";
  // Environment-specific settings
  payeeVPA: string;
  bankId: number;
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

// UAT/Development default values
const UAT_DEFAULTS = {
  payeeVPA: "sprintnxt.8080@jiomerchant",
  bankId: 12,
  txnNote: "test transaction",
};

export class SprintNxtPaymentProvider implements IPaymentProvider {
  name = "SprintNxt UPI";
  private config: SprintNxtConfig;
  private baseUrl: string;

  constructor() {
    const env = (process.env.SPRINTNXT_ENV as "UAT" | "PROD") || "UAT";
    const isProduction = env === "PROD";

    this.config = {
      clientId: process.env.SPRINTNXT_CLIENT_ID || "",
      clientSecret: process.env.SPRINTNXT_CLIENT_SECRET || "",
      encryptionKey: process.env.SPRINTNXT_ENCRYPTION_KEY || "",
      encryptionIV: process.env.SPRINTNXT_ENCRYPTION_IV || "",
      partnerKey: process.env.SPRINTNXT_PARTNER_KEY || "",
      env,
      // Use environment variables for production, UAT defaults for development
      payeeVPA: isProduction
        ? process.env.SPRINTNXT_PAYEE_VPA || ""
        : UAT_DEFAULTS.payeeVPA,
      bankId: isProduction
        ? parseInt(process.env.SPRINTNXT_BANK_ID || "0", 10)
        : UAT_DEFAULTS.bankId,
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
   * Generate unique request ID using cryptographically secure random bytes
   */
  private generateRequestId(): string {
    return `REQ${Date.now()}${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
  }

  /**
   * Generate unique reference ID for transactions using cryptographically secure random bytes
   */
  private generateReferenceId(): string {
    return `TXN${Date.now()}${crypto.randomBytes(6).toString("hex").toUpperCase()}`;
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
        apiId: SprintNxtApiId.VALIDATE_VPA.toString(),
        partnerKey: this.config.partnerKey,
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
      console.log("[SprintNxt] ========== CREATE PAYMENT ==========");
      console.log("[SprintNxt] Environment:", this.config.env);
      console.log("[SprintNxt] Base URL:", this.baseUrl);
      console.log("[SprintNxt] Request:", JSON.stringify({
        orderId: request.orderId,
        amount: request.amount,
        currency: request.currency,
        customerName: request.customerName,
        customerEmail: request.customerEmail,
        customerPhone: request.customerPhone,
      }, null, 2));

      console.log("[SprintNxt] Config:", JSON.stringify({
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret ? `${this.config.clientSecret.substring(0, 8)}...` : "MISSING",
        encryptionKey: this.config.encryptionKey ? `${this.config.encryptionKey.substring(0, 8)}...` : "MISSING",
        encryptionIV: this.config.encryptionIV || "MISSING",
        partnerKey: this.config.partnerKey || "MISSING",
        payeeVPA: this.config.payeeVPA || "MISSING",
        bankId: this.config.bankId || "MISSING",
      }, null, 2));

      if (!this.isAvailable()) {
        console.log("[SprintNxt] isAvailable() returned false - missing config");
        throw new Error("SprintNxt is not configured");
      }

      const referenceId = this.generateReferenceId();
      const isProduction = this.config.env === "PROD";

      // Build payload based on environment
      // UAT: Use test values for testing
      // PROD: Use actual values from request and config
      const payload = isProduction
        ? {
            apiId: SprintNxtApiId.DYNAMIC_QR.toString(),
            referenceid: referenceId,
            partnerKey: this.config.partnerKey,
            payeeVPA: this.config.payeeVPA,
            amount: request.amount.toString(),
            remarks: `Order ${request.orderId}`,
            mobile: request.customerPhone.replace(/\D/g, "").slice(-10),
            email: request.customerEmail,
            bankId: this.config.bankId,
            txnNote: `This is the Payment for Order: ${request.orderId}`,
            txnReferance: referenceId,
            expiryTime: 6,
          }
        : {
            // UAT/Development payload - keep existing test values
            apiId: SprintNxtApiId.DYNAMIC_QR.toString(),
            referenceid: referenceId,
            partnerKey: this.config.partnerKey,
            payeeVPA: UAT_DEFAULTS.payeeVPA,
            amount: "10", // Fixed amount for UAT testing
            remarks: `Order ${request.orderId}`,
            mobile: request.customerPhone.replace(/\D/g, "").slice(-10),
            email: request.customerEmail,
            bankId: UAT_DEFAULTS.bankId,
            txnNote: UAT_DEFAULTS.txnNote,
            txnReferance: referenceId,
          };

      console.log("[SprintNxt] Request payload:", JSON.stringify(payload, null, 2));

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
      console.log("[SprintNxt] ========== VERIFY PAYMENT ==========");
      console.log("[SprintNxt] Environment:", this.config.env);
      console.log("[SprintNxt] Base URL:", this.baseUrl);
      console.log("[SprintNxt] Reference ID:", referenceId);

      if (!this.isAvailable()) {
        console.log("[SprintNxt] isAvailable() returned false - missing config");
        throw new Error("SprintNxt is not configured");
      }

      // SprintNxt requires bankId and txnId for status check
      // Since createPayment uses referenceId as txnReferance, we use the same value here
      const payload = {
        apiId: SprintNxtApiId.GET_TXN_STATUS.toString(),
        partnerKey: this.config.partnerKey,
        referenceid: referenceId,
        bankId: this.config.bankId,
        txnId: referenceId, // Same as referenceid (txnReferance = referenceId in createPayment)
        expiryTime: 6,
      };

      console.log("[SprintNxt] Verify payload:", JSON.stringify(payload, null, 2));

      const response = await this.makeRequest(payload);

      // Extract data from details object, data object (verify response), or root level
      const details = response.details || response.data || response;

      // Map SprintNxt status to PaymentStatus
      // Handle both numeric and string status values
      // Verify response uses 'statusvalue' in data object
      let status: PaymentStatus;
      const rawStatus = details.statusvalue || details.txnStatus || details.status || response.txnStatus || response.status;
      const txnStatus = typeof rawStatus === 'number' ? rawStatus : parseInt(rawStatus);

      console.log("[SprintNxt] Status extraction:", JSON.stringify({
        rawStatus,
        txnStatus,
        source: details.statusvalue ? "data.statusvalue" : details.txnStatus ? "details.txnStatus" : "other"
      }));

      // If status is undefined/NaN, treat as PENDING (still waiting for payment)
      if (rawStatus === undefined || rawStatus === null || isNaN(txnStatus)) {
        console.log("[SprintNxt] No valid status returned, treating as PENDING");
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

      console.log("[SprintNxt] Final status:", status, "| Success:", txnStatus === SprintNxtTxnStatus.SUCCESS);

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
        apiId: SprintNxtApiId.STATIC_QR.toString(),
        partnerKey: this.config.partnerKey,
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
    const baseConfigValid = Boolean(
      this.config.clientId &&
        this.config.clientSecret &&
        this.config.encryptionKey &&
        this.config.encryptionIV &&
        this.config.partnerKey
    );

    // For production, also require payeeVPA and bankId
    if (this.config.env === "PROD") {
      return baseConfigValid && Boolean(this.config.payeeVPA && this.config.bankId);
    }

    return baseConfigValid;
  }
}
