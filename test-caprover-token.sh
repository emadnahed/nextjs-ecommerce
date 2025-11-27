#!/bin/bash

# Test script to verify CapRover APP_TOKEN
# Run this locally before adding the token to GitHub

echo "======================================"
echo "CapRover Token Test Script"
echo "======================================"
echo ""

# Prompt for token
echo "Please paste your CapRover APP_TOKEN (from the 'Enable App Token' button):"
read -r APP_TOKEN

echo ""
echo "Testing token..."
echo ""

# Test the token with a simple API call
# Note: CapRover webhook requires the app name in the payload
RESPONSE=$(curl -X POST \
  "https://captain.rupeestack.com/api/v2/user/apps/webhooks/triggerbuild" \
  -H "Content-Type: application/json" \
  -H "x-namespace: captain" \
  -H "x-captain-app-token: ${APP_TOKEN}" \
  --data-raw '{"schemaVersion":2,"imageName":"test-image","appName":"zeyrey"}' \
  -w "\nHTTP_CODE:%{http_code}" \
  -s)

echo "Response:"
echo "$RESPONSE"
echo ""

# Check the response
if echo "$RESPONSE" | grep -q '"status":1106'; then
  echo "❌ FAILED: Token is corrupted or invalid"
  echo ""
  echo "Please:"
  echo "1. Go to https://captain.rupeestack.com/#/apps/details/zeyrey"
  echo "2. Scroll to 'Method 1: Official CLI'"
  echo "3. Click 'Regenerate Token' or 'Enable App Token'"
  echo "4. Copy the ENTIRE token (triple-click to select all)"
  echo "5. Run this script again"
  exit 1
elif echo "$RESPONSE" | grep -q '"status":'; then
  echo "✅ SUCCESS: Token is valid!"
  echo ""
  echo "The token format is correct. You can now add it to GitHub secrets."
  echo ""
  echo "Next steps:"
  echo "1. Go to: https://github.com/emadnahed/nextjs-ecommerce/settings/secrets/actions"
  echo "2. Find APP_TOKEN and click 'Update'"
  echo "3. Paste this exact token"
  echo "4. Click 'Update secret'"
  exit 0
else
  echo "⚠️  Unexpected response - check the output above"
  exit 1
fi
