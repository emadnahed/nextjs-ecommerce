# SprintNxt Payment Integration - Deployment Guide

## Environment Variables Required

### Production Configuration

Add these environment variables to your CapRover deployment:

```bash
# SprintNxt Production Credentials
SPRINTNXT_CLIENT_ID=SPR_NXT_prod_86cefd361f3fb18a
SPRINTNXT_CLIENT_SECRET=5a13b40cbaac37f39996c1bb20cd26b7e61afc8fca0bdb05b43b63f280aa3836
SPRINTNXT_ENCRYPTION_KEY=67a5c4fa63926d00596c1b43e046bf82
SPRINTNXT_ENCRYPTION_IV=dfc01c6d7d93e776
SPRINTNXT_PARTNER_KEY=NXTU4583807D5918
SPRINTNXT_ENV=PROD
SPRINTNXT_PAYEE_VPA=zeyreytechnolog.8080@jiomerchant
SPRINTNXT_BANK_ID=12
```

### UAT/Testing Configuration (Optional)

For testing in UAT environment:

```bash
# SprintNxt UAT/Sandbox Credentials
SPRINTNXT_CLIENT_ID=SPR_NXT_local_f27c4f1cc617589a
SPRINTNXT_CLIENT_SECRET=9746fa3b89ce8e56198d9846d15afdedc06e1956daf521049d125bc594a53120
SPRINTNXT_ENCRYPTION_KEY=b942644b7f382c8bd541a7da5c0b84e1
SPRINTNXT_ENCRYPTION_IV=de7e6f0d5c88346d
SPRINTNXT_PARTNER_KEY=NXTU4583807D5918
SPRINTNXT_ENV=UAT
```

## How to Deploy to CapRover

1. **Open CapRover Dashboard**: https://captain.rupeestack.com/#/apps/details/zeyrey

2. **Navigate to App Configs Tab**

3. **Scroll to "Environmental Variables" Section**

4. **Add the Variables**:
   - Click "Add More Environmental Variables" or "Bulk Edit"
   - Copy and paste the production configuration above
   - Make sure each variable is on a new line in the format: `KEY=value`

5. **Save & Update**:
   - Click the "Save & Update" button at the bottom
   - CapRover will automatically rebuild and restart your application

6. **Wait for Deployment**:
   - Monitor the deployment progress in the CapRover dashboard
   - Wait for the status to show "Ready" or "Running"

7. **Test the Integration**:
   - Visit your site: https://www.zeyrey.online
   - Go to checkout and select "UPI (Pay via QR Code / UPI Apps)"
   - Complete a test transaction

## Verification Steps

After deployment, verify the integration:

1. **Check Logs**:
   - Go to the "Logs" tab in CapRover
   - Look for `[SprintNxt]` prefixed log messages
   - Verify that configuration is loaded correctly

2. **Test Payment Flow**:
   - Add items to cart
   - Proceed to checkout
   - Select UPI payment method
   - You should see a QR code or UPI intent URL
   - Complete payment using a UPI app

3. **Expected Logs**:
```
[SprintNxt] ========== CREATE PAYMENT ==========
[SprintNxt] Environment: PROD
[SprintNxt] Base URL: https://api.sprintnxt.in/api/v2/UPIService/UPI
[SprintNxt] Config: {
  "clientId": "SPR_NXT_prod_86cefd361f3fb18a",
  "clientSecret": "5a13b40c...",
  "encryptionKey": "67a5c4fa...",
  "encryptionIV": "dfc01c6d7d93e776",
  "partnerKey": "NXTU4583807D5918",
  "payeeVPA": "zeyreytechnolog.8080@jiomerchant",
  "bankId": 12
}
```

## Troubleshooting

### Error: "SprintNxt UPI is not available or not configured"

**Cause**: One or more environment variables are missing or empty.

**Solution**:
1. Verify all 8 environment variables are set in CapRover
2. Check for typos in variable names (they are case-sensitive)
3. Ensure no extra spaces in values
4. Restart the application after adding variables

### Error: "Failed to create payment"

**Cause**: Invalid credentials or API configuration.

**Solution**:
1. Verify credentials with SprintNxt support
2. Check that `SPRINTNXT_ENV` matches your credentials (UAT or PROD)
3. Verify `SPRINTNXT_PAYEE_VPA` and `SPRINTNXT_BANK_ID` are correct

### Payment not completing

**Cause**: QR code generation succeeded but verification failing.

**Solution**:
1. Check logs for verification errors
2. Verify webhook/callback URL is accessible
3. Contact SprintNxt support to verify transaction status

## API Endpoints Used

### Production
- Base URL: `https://api.sprintnxt.in/api/v2/UPIService/UPI`
- Used when `SPRINTNXT_ENV=PROD`

### UAT/Testing
- Base URL: `https://nxt-nonprod.sprintnxt.in/NonProdNextgenAPIExpose/api/v2/UPIService/UPI`
- Used when `SPRINTNXT_ENV=UAT`

## API Methods

### Dynamic QR Payment (API ID: 20260)
Creates a payment with QR code for customer to scan.

### Transaction Status (API ID: 20247)
Verifies payment status and updates order.

### VPA Validation (API ID: 20243)
Validates UPI ID before payment (optional).

## Security Notes

1. **Never commit credentials to git**: Always use environment variables
2. **Encryption**: All API requests use AES-256-CBC encryption
3. **Token expiry**: Authentication tokens are valid for 5 minutes
4. **HTTPS only**: All API calls use HTTPS

## Support

For issues with SprintNxt integration:
1. Check logs in CapRover for detailed error messages
2. Contact SprintNxt support with your `SPRINTNXT_CLIENT_ID`
3. Provide transaction reference IDs for payment issues

## Recent Fixes (2025-11-27)

1. ✅ Added `partnerKey` field to all API requests
2. ✅ Standardized field naming (`apiId` with `.toString()`)
3. ✅ Fixed data type conversions for consistency
4. ✅ Updated environment variable validation in `isAvailable()`
