#!/bin/bash
# Test cases for Catalog Management Agent API
# Run with: bash test-api.sh

BASE_URL="http://localhost:3000"

echo "======================================"
echo "Catalog Management Agent - Test Cases"
echo "======================================"
echo ""

# ============================================================================
# 1. HEALTH CHECK & INFO ENDPOINTS
# ============================================================================

echo "1️⃣  HEALTH CHECK ENDPOINT"
echo "GET $BASE_URL/health"
curl -X GET "$BASE_URL/health" -H "Content-Type: application/json" | jq .
echo ""

echo "2️⃣  API OVERVIEW"
echo "GET $BASE_URL/"
curl -X GET "$BASE_URL/" -H "Content-Type: application/json" | jq .
echo ""

# ============================================================================
# 2. PRODUCT ENDPOINTS
# ============================================================================

echo "3️⃣  GET PRODUCT BY ID"
echo "GET $BASE_URL/api/products/prod-001"
curl -X GET "$BASE_URL/api/products/prod-001" -H "Content-Type: application/json" | jq .
echo ""

echo "4️⃣  LIST PRODUCTS WITH FILTER"
echo "GET $BASE_URL/api/products?category=Electronics&limit=5&skip=0"
curl -X GET "$BASE_URL/api/products?category=Electronics&limit=5&skip=0" -H "Content-Type: application/json" | jq .
echo ""

echo "5️⃣  CREATE NEW PRODUCT"
echo "POST $BASE_URL/api/products"
curl -X POST "$BASE_URL/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "LAPTOP-SAMSUNG-001",
    "name": "Samsung XPS 15 Laptop",
    "description": "High-performance 15-inch laptop with Intel processor",
    "category": "Electronics > Computers > Laptops"
  }' | jq .
echo ""

echo "6️⃣  UPDATE PRODUCT (PATCH)"
echo "PATCH $BASE_URL/api/products/prod-001"
curl -X PATCH "$BASE_URL/api/products/prod-001" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Product Name",
    "category": "Electronics > Computers"
  }' | jq .
echo ""

# ============================================================================
# 3. AGENT TOOLS
# ============================================================================

echo "7️⃣  AGENT TOOL: CLASSIFY PRODUCT"
echo "POST $BASE_URL/api/agent/classify"
curl -X POST "$BASE_URL/api/agent/classify" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod-001",
    "productAttributes": {
      "brand": "Samsung",
      "screen_size": "15.6 inches",
      "processor": "Intel Core i7"
    },
    "description": "Premium 15-inch laptop with high-performance specs",
    "imageUrl": "https://example.com/images/laptop-001.jpg"
  }' | jq .
echo ""

echo "8️⃣  AGENT TOOL: TAG PRODUCT"
echo "POST $BASE_URL/api/agent/tag"
curl -X POST "$BASE_URL/api/agent/tag" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod-001",
    "description": "Samsung XPS 15 Laptop, Space Gray, 512GB SSD, 16GB RAM",
    "imageUrls": [
      "https://example.com/images/laptop-hero.jpg",
      "https://example.com/images/laptop-side.jpg",
      "https://example.com/images/laptop-keyboard.jpg"
    ]
  }' | jq .
echo ""

echo "9️⃣  AGENT TOOL: SEQUENCE IMAGES"
echo "POST $BASE_URL/api/agent/sequence-images"
curl -X POST "$BASE_URL/api/agent/sequence-images" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod-001",
    "imageUrls": [
      "https://example.com/images/side-view.jpg",
      "https://example.com/images/hero-shot.jpg",
      "https://example.com/images/keyboard-detail.jpg",
      "https://example.com/images/package.jpg"
    ],
    "category": "Electronics > Computers > Laptops",
    "marketplace": "amazon"
  }' | jq .
echo ""

echo "🔟 AGENT TOOL: CHECK DATA QUALITY"
echo "POST $BASE_URL/api/agent/check-quality"
curl -X POST "$BASE_URL/api/agent/check-quality" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod-001",
    "category": "Electronics > Computers > Laptops"
  }' | jq .
echo ""

echo "1️⃣1️⃣ AGENT TOOL: BULK UPDATE PRODUCTS"
echo "POST $BASE_URL/api/agent/bulk-update"
curl -X POST "$BASE_URL/api/agent/bulk-update" \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {
        "productId": "prod-001",
        "updates": { "category": "Electronics > Computers > Laptops" }
      },
      {
        "productId": "prod-002",
        "updates": { "category": "Electronics > Computers > Laptops" }
      },
      {
        "productId": "prod-003",
        "updates": { "category": "Electronics > Computers > Laptops" }
      }
    ],
    "approvalThreshold": 1000
  }' | jq .
echo ""

echo "======================================"
echo "✅ All tests completed!"
echo "======================================"
