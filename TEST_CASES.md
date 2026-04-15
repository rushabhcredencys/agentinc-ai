# Catalog Management Agent - Test Cases Documentation

## Quick Start

Choose one of the following test script formats:

### Option 1: PowerShell (Windows)
```powershell
cd d:\Claude\AI_Agent\catalog-management-agent
.\test-api.ps1
```

### Option 2: Bash/Shell (Linux/Mac)
```bash
cd /path/to/catalog-management-agent
bash test-api.sh
```

### Option 3: Node.js/TypeScript
```bash
cd d:\Claude\AI_Agent\catalog-management-agent
npm test -- src/tests/api.test.ts
```

### Option 4: Manual cURL (Linux/Mac)
```bash
# Test health endpoint
curl -X GET http://localhost:3000/health | jq .

# Create a product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"sku":"PROD-001","name":"Test Product","category":"Electronics"}'
```

---

## Test Cases Overview

### 1️⃣ Health Check Endpoint
**Endpoint**: `GET /health`  
**Purpose**: Verify server is running  
**Expected Response**: `{ success: true, message: "Agent is running", uptime: 123.45 }`

---

### 2️⃣ API Overview
**Endpoint**: `GET /`  
**Purpose**: Get available endpoints  
**Expected Response**: Lists all API routes and documentation links

---

### 3️⃣ Get Product by ID
**Endpoint**: `GET /api/products/prod-001`  
**Purpose**: Retrieve a single product by ID  
**Expected Response**:
```json
{
  "success": true,
  "data": {
    "id": "prod-001",
    "sku": "SKU-001",
    "name": "Sample Product",
    "category": "Electronics",
    "version": 1
  }
}
```

---

### 4️⃣ List Products with Filters
**Endpoint**: `GET /api/products?category=Electronics&limit=5&skip=0`  
**Purpose**: Query products by category with pagination  
**Query Parameters**:
- `category` - Filter by category (optional)
- `limit` - Number of results (default: 10)
- `skip` - Number of records to skip (default: 0)

**Expected Response**:
```json
{
  "success": true,
  "data": []
}
```

---

### 5️⃣ Create New Product
**Endpoint**: `POST /api/products`  
**Purpose**: Create a new product record  
**Payload**:
```json
{
  "sku": "LAPTOP-SAMSUNG-001",
  "name": "Samsung XPS 15 Laptop",
  "description": "High-performance 15-inch laptop",
  "category": "Electronics > Computers > Laptops"
}
```

**Expected Response** (HTTP 201):
```json
{
  "success": true,
  "data": {
    "id": "product-123",
    "sku": "LAPTOP-SAMSUNG-001",
    "name": "Samsung XPS 15 Laptop",
    "version": 1
  }
}
```

---

### 6️⃣ Update Product (Partial)
**Endpoint**: `PATCH /api/products/prod-001`  
**Purpose**: Partially update a product  
**Payload**:
```json
{
  "name": "Updated Product Name",
  "category": "Electronics > Computers > Premium Laptops"
}
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "id": "prod-001",
    "name": "Updated Product Name",
    "version": 2
  }
}
```

---

## Agent Tools Test Cases

### 7️⃣ Classify Product
**Endpoint**: `POST /api/agent/classify`  
**Purpose**: Automatically classify a product into a category  
**Payload**:
```json
{
  "productId": "prod-001",
  "productAttributes": {
    "brand": "Samsung",
    "screen_size": "15.6 inches",
    "processor": "Intel Core i7"
  },
  "description": "Premium 15-inch laptop with high-performance specs",
  "imageUrl": "https://example.com/images/laptop-001.jpg"
}
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "categoryPath": "Electronics > Computers > Laptops",
    "confidence": 0.92,
    "top3Candidates": [
      { "category": "Electronics > Computers > Laptops", "confidence": 0.92 },
      { "category": "Electronics > Computers > Tablets", "confidence": 0.05 },
      { "category": "Electronics > Accessories", "confidence": 0.03 }
    ],
    "model": "classification-v1"
  }
}
```

---

### 8️⃣ Tag Product
**Endpoint**: `POST /api/agent/tag`  
**Purpose**: Extract and suggest product attributes from images/description  
**Payload**:
```json
{
  "productId": "prod-001",
  "description": "Samsung XPS 15 Laptop, Space Gray, 512GB SSD, 16GB RAM",
  "imageUrls": [
    "https://example.com/images/laptop-hero.jpg",
    "https://example.com/images/laptop-side.jpg",
    "https://example.com/images/laptop-keyboard.jpg"
  ]
}
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "tags": [
      { "name": "brand", "value": "Samsung", "confidence": 0.95 },
      { "name": "color", "value": "Space Gray", "confidence": 0.88 },
      { "name": "storage", "value": "512GB SSD", "confidence": 0.92 },
      { "name": "ram", "value": "16GB", "confidence": 0.90 }
    ]
  }
}
```

---

### 9️⃣ Sequence Images
**Endpoint**: `POST /api/agent/sequence-images`  
**Purpose**: Intelligently order product images by type  
**Payload**:
```json
{
  "productId": "prod-001",
  "imageUrls": [
    "https://example.com/images/side-view.jpg",
    "https://example.com/images/hero-shot.jpg",
    "https://example.com/images/keyboard-detail.jpg",
    "https://example.com/images/package.jpg"
  ],
  "category": "Electronics > Computers > Laptops",
  "marketplace": "amazon"
}
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "orderedImages": [
      { "url": "hero-shot.jpg", "type": "hero", "position": 1, "confidence": 0.98 },
      { "url": "lifestyle.jpg", "type": "lifestyle", "position": 2, "confidence": 0.95 },
      { "url": "keyboard-detail.jpg", "type": "detail", "position": 3, "confidence": 0.92 }
    ]
  }
}
```

**Image Types**: hero, lifestyle, detail, swatch, packaging, manual

---

### 🔟 Check Data Quality
**Endpoint**: `POST /api/agent/check-quality`  
**Purpose**: Score product data completeness and identify gaps  
**Payload**:
```json
{
  "productId": "prod-001",
  "category": "Electronics > Computers > Laptops"
}
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "completenessScore": 75,
    "missingFields": [
      "warranty_info",
      "specifications.weight"
    ],
    "recommendedActions": [
      "Add warranty information",
      "Complete product specifications",
      "Add country of origin"
    ],
    "lastChecked": "2026-04-14T17:12:00Z"
  }
}
```

---

### 1️⃣1️⃣ Bulk Update Products
**Endpoint**: `POST /api/agent/bulk-update`  
**Purpose**: Update multiple products with approval workflow  
**Payload**:
```json
{
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
}
```

**Expected Response** (HTTP 202 - Accepted):
```json
{
  "success": true,
  "data": {
    "jobId": "job-bulk-update-1713084720000",
    "estimatedTime": 120,
    "statusUrl": "/api/agent/jobs/job-bulk-update-1713084720000",
    "requiresApproval": false
  }
}
```

---

## Error Scenarios to Test

### Invalid Request
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Missing SKU"}'
```

**Expected Response** (HTTP 400):
```json
{
  "success": false,
  "error": "ValidationError: SKU is required"
}
```

### Not Found
```bash
curl -X GET http://localhost:3000/api/products/nonexistent-id
```

**Expected Response** (HTTP 404):
```json
{
  "success": false,
  "error": "Product not found"
}
```

### Server Error
```bash
# Any catastrophic error
```

**Expected Response** (HTTP 500):
```json
{
  "success": false,
  "error": "Internal Server Error"
}
```

---

## Performance Test Cases

### Load Test: 100 concurrent requests
```bash
# Using Apache Bench (ab)
ab -n 100 -c 10 http://localhost:3000/health

# Using wrk (better for concurrent)
wrk -t 4 -c 10 -d 30s http://localhost:3000/health
```

### Latency Test: Check response times
- Health check: < 10ms
- Single product query: < 500ms
- Classification: < 2s
- Tagging: < 5s (batch of 10)
- Bulk update: < 30s (1000 products)

---

## Test Checklist

- [ ] Server is running on localhost:3000
- [ ] Health check returns 200 status
- [ ] All CRUD endpoints work
- [ ] Agent tools respond with correct schemas
- [ ] Error handling returns proper status codes
- [ ] Response times meet SLAs
- [ ] Concurrent requests don't cause issues
- [ ] Database operations (when implemented) work correctly

---

## Next Steps for Full Testing

1. **Database Integration**: Test with real PostgreSQL database
2. **Authentication**: Add JWT tokens to requests
3. **Event Streaming**: Test Kafka/RabbitMQ integration
4. **Job Queue**: Monitor Bull/Temporal jobs
5. **AI Models**: Test actual classification/tagging models
6. **Load Testing**: Run performance benchmarks at scale
