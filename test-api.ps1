# PowerShell Test Cases for Catalog Management Agent API
# Run each test individually or source this file

$BASE_URL = "http://localhost:3000"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Catalog Management Agent - Test Cases" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# 1. HEALTH CHECK & INFO ENDPOINTS
# ============================================================================

Write-Host "1️⃣  HEALTH CHECK ENDPOINT" -ForegroundColor Green
Write-Host "GET $BASE_URL/health" -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "$BASE_URL/health" -Method Get -ContentType "application/json"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
Write-Host ""

Write-Host "2️⃣  API OVERVIEW" -ForegroundColor Green
Write-Host "GET $BASE_URL/" -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "$BASE_URL/" -Method Get -ContentType "application/json"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
Write-Host ""

# ============================================================================
# 2. PRODUCT ENDPOINTS
# ============================================================================

Write-Host "3️⃣  GET PRODUCT BY ID" -ForegroundColor Green
Write-Host "GET $BASE_URL/api/products/prod-001" -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "$BASE_URL/api/products/prod-001" -Method Get -ContentType "application/json"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
Write-Host ""

Write-Host "4️⃣  LIST PRODUCTS WITH FILTER" -ForegroundColor Green
Write-Host "GET $BASE_URL/api/products?category=Electronics&limit=5&skip=0" -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "$BASE_URL/api/products?category=Electronics&limit=5&skip=0" -Method Get -ContentType "application/json"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
Write-Host ""

Write-Host "5️⃣  CREATE NEW PRODUCT" -ForegroundColor Green
Write-Host "POST $BASE_URL/api/products" -ForegroundColor Yellow
$body = @{
    sku = "LAPTOP-SAMSUNG-001"
    name = "Samsung XPS 15 Laptop"
    description = "High-performance 15-inch laptop with Intel processor"
    category = "Electronics > Computers > Laptops"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$BASE_URL/api/products" `
  -Method Post `
  -Body $body `
  -ContentType "application/json"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
Write-Host ""

Write-Host "6️⃣  UPDATE PRODUCT (PATCH)" -ForegroundColor Green
Write-Host "PATCH $BASE_URL/api/products/prod-001" -ForegroundColor Yellow
$body = @{
    name = "Updated Samsung XPS 15"
    category = "Electronics > Computers > Premium Laptops"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$BASE_URL/api/products/prod-001" `
  -Method Patch `
  -Body $body `
  -ContentType "application/json"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
Write-Host ""

# ============================================================================
# 3. AGENT TOOLS
# ============================================================================

Write-Host "7️⃣  AGENT TOOL: CLASSIFY PRODUCT" -ForegroundColor Green
Write-Host "POST $BASE_URL/api/agent/classify" -ForegroundColor Yellow
$body = @{
    productId = "prod-001"
    productAttributes = @{
        brand = "Samsung"
        screen_size = "15.6 inches"
        processor = "Intel Core i7"
    }
    description = "Premium 15-inch laptop with high-performance specs"
    imageUrl = "https://example.com/images/laptop-001.jpg"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$BASE_URL/api/agent/classify" `
  -Method Post `
  -Body $body `
  -ContentType "application/json"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
Write-Host ""

Write-Host "8️⃣  AGENT TOOL: TAG PRODUCT" -ForegroundColor Green
Write-Host "POST $BASE_URL/api/agent/tag" -ForegroundColor Yellow
$body = @{
    productId = "prod-001"
    description = "Samsung XPS 15 Laptop, Space Gray, 512GB SSD, 16GB RAM"
    imageUrls = @(
        "https://example.com/images/laptop-hero.jpg",
        "https://example.com/images/laptop-side.jpg",
        "https://example.com/images/laptop-keyboard.jpg"
    )
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$BASE_URL/api/agent/tag" `
  -Method Post `
  -Body $body `
  -ContentType "application/json"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
Write-Host ""

Write-Host "9️⃣  AGENT TOOL: SEQUENCE IMAGES" -ForegroundColor Green
Write-Host "POST $BASE_URL/api/agent/sequence-images" -ForegroundColor Yellow
$body = @{
    productId = "prod-001"
    imageUrls = @(
        "https://example.com/images/side-view.jpg",
        "https://example.com/images/hero-shot.jpg",
        "https://example.com/images/keyboard-detail.jpg",
        "https://example.com/images/package.jpg"
    )
    category = "Electronics > Computers > Laptops"
    marketplace = "amazon"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$BASE_URL/api/agent/sequence-images" `
  -Method Post `
  -Body $body `
  -ContentType "application/json"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
Write-Host ""

Write-Host "🔟 AGENT TOOL: CHECK DATA QUALITY" -ForegroundColor Green
Write-Host "POST $BASE_URL/api/agent/check-quality" -ForegroundColor Yellow
$body = @{
    productId = "prod-001"
    category = "Electronics > Computers > Laptops"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$BASE_URL/api/agent/check-quality" `
  -Method Post `
  -Body $body `
  -ContentType "application/json"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
Write-Host ""

Write-Host "1️⃣1️⃣ AGENT TOOL: BULK UPDATE PRODUCTS" -ForegroundColor Green
Write-Host "POST $BASE_URL/api/agent/bulk-update" -ForegroundColor Yellow
$body = @{
    updates = @(
        @{
            productId = "prod-001"
            updates = @{ category = "Electronics > Computers > Laptops" }
        },
        @{
            productId = "prod-002"
            updates = @{ category = "Electronics > Computers > Laptops" }
        },
        @{
            productId = "prod-003"
            updates = @{ category = "Electronics > Computers > Laptops" }
        }
    )
    approvalThreshold = 1000
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$BASE_URL/api/agent/bulk-update" `
  -Method Post `
  -Body $body `
  -ContentType "application/json"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
Write-Host ""

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "✅ All tests completed!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
