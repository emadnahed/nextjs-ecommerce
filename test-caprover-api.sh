#!/bin/bash

# Test different CapRover API endpoints to find the right one

echo "======================================"
echo "CapRover API Test Script"
echo "======================================"
echo ""

echo "Please paste your CapRover APP_TOKEN:"
read -r APP_TOKEN

echo ""
echo "Testing different API methods..."
echo ""

# Method 1: Webhook trigger (current approach)
echo "1. Testing webhook trigger API..."
RESPONSE1=$(curl -X POST \
  "https://captain.rupeestack.com/api/v2/user/apps/webhooks/triggerbuild" \
  -H "Content-Type: application/json" \
  -H "x-namespace: captain" \
  -H "x-captain-app-token: ${APP_TOKEN}" \
  --data-raw '{"schemaVersion":2,"imageName":"test-image"}' \
  -s)
echo "Response: $RESPONSE1"
echo ""

# Method 2: Direct app update
echo "2. Testing direct app update API..."
RESPONSE2=$(curl -X POST \
  "https://captain.rupeestack.com/api/v2/user/apps/appDefinitions/update" \
  -H "Content-Type: application/json" \
  -H "x-namespace: captain" \
  -H "x-captain-app-token: ${APP_TOKEN}" \
  --data-raw '{"appName":"zeyrey","imageName":"test-image"}' \
  -s)
echo "Response: $RESPONSE2"
echo ""

# Method 3: Check if we can at least authenticate
echo "3. Testing basic authentication..."
RESPONSE3=$(curl -X GET \
  "https://captain.rupeestack.com/api/v2/user/apps/appDefinitions" \
  -H "x-namespace: captain" \
  -H "x-captain-app-token: ${APP_TOKEN}" \
  -s)
echo "Response: $RESPONSE3"
echo ""

echo "======================================"
echo "Analysis:"
echo "======================================"

if echo "$RESPONSE1 $RESPONSE2 $RESPONSE3" | grep -q '"status":1106'; then
  echo "❌ All methods failed with 'Auth token corrupted'"
  echo ""
  echo "This suggests the APP_TOKEN itself might not be the right credential."
  echo ""
  echo "Possible issues:"
  echo "1. The 'App Token' in CapRover UI might be for CLI use, not API"
  echo "2. You might need to use your main CapRover password instead"
  echo "3. The token format might be different"
  echo ""
  echo "Let's try manual deployment instead:"
  echo "1. Go to: https://captain.rupeestack.com/#/apps/details/zeyrey"
  echo "2. Find 'Method 2: Tarball' or 'Deploy via ImageName'"
  echo "3. Enter: ghcr.io/emadnahed/nextjs-ecommerce:sha-abc41f5"
  echo "4. Click Deploy"
elif echo "$RESPONSE1 $RESPONSE2 $RESPONSE3" | grep -q '"status":100\|"status":101'; then
  echo "✅ Authentication works!"
  echo "One of the methods succeeded. Check the responses above."
else
  echo "⚠️  Unexpected responses - please review above"
fi
