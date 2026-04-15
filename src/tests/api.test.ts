import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

// Helper function for pretty printing
const printTest = (testNumber: string, testName: string, method: string, endpoint: string) => {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`${testNumber} ${testName}`);
  console.log(`${method} ${BASE_URL}${endpoint}`);
  console.log(`${'='.repeat(70)}`);
};

// Test cases
async function runTests() {
  try {
    // ====================================================================
    // 1. HEALTH CHECK & INFO ENDPOINTS
    // ====================================================================

    printTest('1️⃣', 'HEALTH CHECK ENDPOINT', 'GET', '/health');
    let response = await axios.get(`${BASE_URL}/health`);
    console.log(JSON.stringify(response.data, null, 2));

    printTest('2️⃣', 'API OVERVIEW', 'GET', '/');
    response = await axios.get(`${BASE_URL}/`);
    console.log(JSON.stringify(response.data, null, 2));

    // ====================================================================
    // 2. PRODUCT ENDPOINTS
    // ====================================================================

    printTest('3️⃣', 'GET PRODUCT BY ID', 'GET', '/api/products/prod-001');
    response = await axios.get(`${BASE_URL}/api/products/prod-001`);
    console.log(JSON.stringify(response.data, null, 2));

    printTest('4️⃣', 'LIST PRODUCTS WITH FILTER', 'GET', '/api/products?category=Electronics&limit=5');
    response = await axios.get(`${BASE_URL}/api/products`, {
      params: {
        category: 'Electronics',
        limit: 5,
        skip: 0,
      },
    });
    console.log(JSON.stringify(response.data, null, 2));

    printTest('5️⃣', 'CREATE NEW PRODUCT', 'POST', '/api/products');
    response = await axios.post(`${BASE_URL}/api/products`, {
      sku: 'LAPTOP-SAMSUNG-001',
      name: 'Samsung XPS 15 Laptop',
      description: 'High-performance 15-inch laptop with Intel processor',
      category: 'Electronics > Computers > Laptops',
    });
    console.log(JSON.stringify(response.data, null, 2));

    printTest('6️⃣', 'UPDATE PRODUCT (PATCH)', 'PATCH', '/api/products/prod-001');
    response = await axios.patch(`${BASE_URL}/api/products/prod-001`, {
      name: 'Updated Samsung XPS 15',
      category: 'Electronics > Computers > Premium Laptops',
    });
    console.log(JSON.stringify(response.data, null, 2));

    // ====================================================================
    // 3. AGENT TOOLS
    // ====================================================================

    printTest('7️⃣', 'AGENT TOOL: CLASSIFY PRODUCT', 'POST', '/api/agent/classify');
    response = await axios.post(`${BASE_URL}/api/agent/classify`, {
      productId: 'prod-001',
      productAttributes: {
        brand: 'Samsung',
        screen_size: '15.6 inches',
        processor: 'Intel Core i7',
      },
      description: 'Premium 15-inch laptop with high-performance specs',
      imageUrl: 'https://example.com/images/laptop-001.jpg',
    });
    console.log(JSON.stringify(response.data, null, 2));

    printTest('8️⃣', 'AGENT TOOL: TAG PRODUCT', 'POST', '/api/agent/tag');
    response = await axios.post(`${BASE_URL}/api/agent/tag`, {
      productId: 'prod-001',
      description: 'Samsung XPS 15 Laptop, Space Gray, 512GB SSD, 16GB RAM',
      imageUrls: [
        'https://example.com/images/laptop-hero.jpg',
        'https://example.com/images/laptop-side.jpg',
        'https://example.com/images/laptop-keyboard.jpg',
      ],
    });
    console.log(JSON.stringify(response.data, null, 2));

    printTest('9️⃣', 'AGENT TOOL: SEQUENCE IMAGES', 'POST', '/api/agent/sequence-images');
    response = await axios.post(`${BASE_URL}/api/agent/sequence-images`, {
      productId: 'prod-001',
      imageUrls: [
        'https://example.com/images/side-view.jpg',
        'https://example.com/images/hero-shot.jpg',
        'https://example.com/images/keyboard-detail.jpg',
        'https://example.com/images/package.jpg',
      ],
      category: 'Electronics > Computers > Laptops',
      marketplace: 'amazon',
    });
    console.log(JSON.stringify(response.data, null, 2));

    printTest('🔟', 'AGENT TOOL: CHECK DATA QUALITY', 'POST', '/api/agent/check-quality');
    response = await axios.post(`${BASE_URL}/api/agent/check-quality`, {
      productId: 'prod-001',
      category: 'Electronics > Computers > Laptops',
    });
    console.log(JSON.stringify(response.data, null, 2));

    printTest('1️⃣1️⃣', 'AGENT TOOL: BULK UPDATE PRODUCTS', 'POST', '/api/agent/bulk-update');
    response = await axios.post(`${BASE_URL}/api/agent/bulk-update`, {
      updates: [
        {
          productId: 'prod-001',
          updates: { category: 'Electronics > Computers > Laptops' },
        },
        {
          productId: 'prod-002',
          updates: { category: 'Electronics > Computers > Laptops' },
        },
        {
          productId: 'prod-003',
          updates: { category: 'Electronics > Computers > Laptops' },
        },
      ],
      approvalThreshold: 1000,
    });
    console.log(JSON.stringify(response.data, null, 2));

    console.log(`\n${'='.repeat(70)}`);
    console.log('✅ All tests completed successfully!');
    console.log(`${'='.repeat(70)}\n`);
  } catch (error: any) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Run tests
runTests();
