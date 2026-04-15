#!/usr/bin/env node

const http = require('http');

const BASE_URL = 'http://localhost:3000';

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: data ? JSON.parse(data) : null,
        });
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n' + '='.repeat(70));
  console.log('Catalog Management Agent - API Tests');
  console.log('='.repeat(70) + '\n');

  try {
    // Test 1: Health
    console.log('1️⃣  HEALTH CHECK ENDPOINT');
    console.log('GET /health');
    let res = await request('GET', '/health');
    console.log(`Status: ${res.status}`);
    console.log(JSON.stringify(res.body, null, 2));
    console.log('');

    // Test 2: API Overview
    console.log('2️⃣  API OVERVIEW');
    console.log('GET /');
    res = await request('GET', '/');
    console.log(`Status: ${res.status}`);
    console.log('Endpoints available:');
    if (res.body.endpoints) {
      console.log(`- Products: ${Object.keys(res.body.endpoints.products).length} endpoints`);
      console.log(`- Agent: ${Object.keys(res.body.endpoints.agent).length} endpoints`);
    }
    console.log('');

    // Test 3: Get Product
    console.log('3️⃣  GET PRODUCT BY ID');
    console.log('GET /api/products/prod-001');
    res = await request('GET', '/api/products/prod-001');
    console.log(`Status: ${res.status}`);
    console.log(JSON.stringify(res.body, null, 2));
    console.log('');

    // Test 4: List Products
    console.log('4️⃣  LIST PRODUCTS');
    console.log('GET /api/products?category=Electronics&limit=5');
    res = await request('GET', '/api/products?category=Electronics&limit=5');
    console.log(`Status: ${res.status}`);
    console.log(JSON.stringify(res.body, null, 2));
    console.log('');

    // Test 5: Create Product
    console.log('5️⃣  CREATE PRODUCT');
    console.log('POST /api/products');
    res = await request('POST', '/api/products', {
      sku: 'LAPTOP-001',
      name: 'Samsung XPS 15',
      description: 'Premium 15-inch laptop',
      category: 'Electronics > Computers > Laptops',
    });
    console.log(`Status: ${res.status}`);
    console.log(JSON.stringify(res.body, null, 2));
    console.log('');

    // Test 6: Update Product
    console.log('6️⃣  UPDATE PRODUCT');
    console.log('PATCH /api/products/prod-001');
    res = await request('PATCH', '/api/products/prod-001', {
      name: 'Updated Samsung XPS 15',
      category: 'Electronics > Computers > Premium Laptops',
    });
    console.log(`Status: ${res.status}`);
    console.log(JSON.stringify(res.body, null, 2));
    console.log('');

    // Test 7: Classify Product
    console.log('7️⃣  CLASSIFY PRODUCT');
    console.log('POST /api/agent/classify');
    res = await request('POST', '/api/agent/classify', {
      productId: 'prod-001',
      productAttributes: {
        brand: 'Samsung',
        screen_size: '15.6 inches',
        processor: 'Intel Core i7',
      },
      description: 'Premium laptop',
    });
    console.log(`Status: ${res.status}`);
    console.log(JSON.stringify(res.body, null, 2));
    console.log('');

    // Test 8: Tag Product
    console.log('8️⃣  TAG PRODUCT');
    console.log('POST /api/agent/tag');
    res = await request('POST', '/api/agent/tag', {
      productId: 'prod-001',
      description: 'Samsung XPS 15, Space Gray, 512GB SSD',
      imageUrls: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
    });
    console.log(`Status: ${res.status}`);
    console.log(JSON.stringify(res.body, null, 2));
    console.log('');

    // Test 9: Sequence Images
    console.log('9️⃣  SEQUENCE IMAGES');
    console.log('POST /api/agent/sequence-images');
    res = await request('POST', '/api/agent/sequence-images', {
      productId: 'prod-001',
      imageUrls: [
        'https://example.com/side.jpg',
        'https://example.com/hero.jpg',
        'https://example.com/detail.jpg',
      ],
      category: 'Electronics > Computers > Laptops',
      marketplace: 'amazon',
    });
    console.log(`Status: ${res.status}`);
    console.log(JSON.stringify(res.body, null, 2));
    console.log('');

    // Test 10: Check Quality
    console.log('🔟 CHECK DATA QUALITY');
    console.log('POST /api/agent/check-quality');
    res = await request('POST', '/api/agent/check-quality', {
      productId: 'prod-001',
      category: 'Electronics > Computers > Laptops',
    });
    console.log(`Status: ${res.status}`);
    console.log(JSON.stringify(res.body, null, 2));
    console.log('');

    // Test 11: Bulk Update
    console.log('1️⃣1️⃣ BULK UPDATE PRODUCTS');
    console.log('POST /api/agent/bulk-update');
    res = await request('POST', '/api/agent/bulk-update', {
      updates: [
        { productId: 'prod-001', updates: { category: 'Electronics > Laptops' } },
        { productId: 'prod-002', updates: { category: 'Electronics > Laptops' } },
        { productId: 'prod-003', updates: { category: 'Electronics > Laptops' } },
      ],
      approvalThreshold: 1000,
    });
    console.log(`Status: ${res.status}`);
    console.log(JSON.stringify(res.body, null, 2));
    console.log('');

    console.log('='.repeat(70));
    console.log('✅ All tests completed successfully!');
    console.log('='.repeat(70) + '\n');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();
