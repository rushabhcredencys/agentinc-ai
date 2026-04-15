/**
 * Test script for the description generation API
 * This demonstrates how to use the description generation endpoints
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

interface TestConfig {
  apiEndpoint?: string;
  plantId?: string;
  plantName?: string;
  plantType?: string;
}

async function testGenerateFromApi(config: TestConfig) {
  console.log('\n=== Testing: Generate Description from External API ===\n');

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/descriptions/generate`,
      {
        apiEndpoint: config.apiEndpoint || 'http://dev.ewec.local/get-plant?plantId=30',
        plantId: config.plantId || '30',
      }
    );

    console.log('✓ Success:\n');
    console.log(JSON.stringify(response.data, null, 2));

    if (response.data.data?.description) {
      console.log('\n📄 Short Description:');
      console.log(response.data.data.description.shortDescription);

      console.log('\n📋 Long Description:');
      console.log(response.data.data.description.longDescription);

      console.log('\n⭐ Key Features:');
      response.data.data.description.keyFeatures.forEach((feature: string) => {
        console.log(`  - ${feature}`);
      });
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('✗ Error:\n');
      console.error(JSON.stringify(error.response?.data || error.message, null, 2));
    } else {
      console.error('✗ Unexpected error:', error);
    }
    throw error;
  }
}

async function testGenerateFromData(config: TestConfig) {
  console.log('\n=== Testing: Generate Description from Raw Data ===\n');

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/descriptions/generate-from-data`,
      {
        plantName: config.plantName || 'Al Dhafrah PV2 plant',
        plantType: config.plantType || 'Battery',
        configuration: {
          power: 'Nuclear',
          solar: 'PV',
          battery: 'Other',
        },
        contractPeriod: [
          '2025-06-30T18:30:00.000000Z',
          '2025-07-15T18:30:00.000000Z',
        ],
      }
    );

    console.log('✓ Success:\n');
    console.log(JSON.stringify(response.data, null, 2));

    if (response.data.data) {
      console.log('\n📄 Generated Description:');
      console.log(JSON.stringify(response.data.data, null, 2));
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('✗ Error:\n');
      console.error(JSON.stringify(error.response?.data || error.message, null, 2));
    } else {
      console.error('✗ Unexpected error:', error);
    }
    throw error;
  }
}

async function testBatchGenerateDescriptions(plantIds: string[]) {
  console.log(`\n=== Testing: Batch Generate Descriptions (${plantIds.length} plants) ===\n`);

  const results: any[] = [];

  for (const plantId of plantIds) {
    try {
      console.log(`Processing plant ${plantId}...`);

      const response = await axios.post(
        `${API_BASE_URL}/api/descriptions/generate`,
        {
          apiEndpoint: `http://dev.ewec.local/get-plant?plantId=${plantId}`,
          plantId,
        }
      );

      results.push({
        plantId,
        success: true,
        description: response.data.data?.description,
      });

      console.log(`✓ Plant ${plantId} - Description generated`);
    } catch (error) {
      console.log(`✗ Plant ${plantId} - Failed`);
      results.push({
        plantId,
        success: false,
        error: axios.isAxiosError(error) ? error.message : 'Unknown error',
      });
    }
  }

  console.log('\n=== Batch Results Summary ===\n');
  results.forEach((result) => {
    const status = result.success ? '✓' : '✗';
    console.log(`${status} Plant ${result.plantId}: ${result.success ? 'Success' : 'Failed'}`);
    if (result.success && result.description) {
      console.log(`   ${result.description.shortDescription}\n`);
    }
  });

  return results;
}

async function runAllTests() {
  console.log('🚀 Starting Description Generation API Tests\n');
  console.log(`Target API: ${API_BASE_URL}\n`);

  try {
    // Test 1: Generate from API
    await testGenerateFromApi({
      apiEndpoint: 'http://dev.ewec.local/get-plant?plantId=30',
      plantId: '30',
    });

    // Test 2: Generate from data
    await testGenerateFromData({
      plantName: 'Al Dhafrah PV2 plant',
      plantType: 'Battery',
    });

    // Test 3: Batch generation (optional - comment out if default endpoint not available)
    // await testBatchGenerateDescriptions(['30', '31', '32']);

    console.log('\n✓ All tests completed successfully!\n');
  } catch (error) {
    console.error('\n✗ Tests failed with error\n');
    process.exit(1);
  }
}

// Usage examples
async function exampleUsage() {
  console.log('📚 Example: How to fetch and generate description\n');

  const code = `
// Example 1: Generate from API Endpoint
const response = await fetch('http://localhost:3000/api/descriptions/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    apiEndpoint: 'http://dev.ewec.local/get-plant?plantId=30',
    plantId: '30'
  })
});
const data = await response.json();
console.log(data.data.description.shortDescription);

// Example 2: Generate from Raw Data
const response2 = await fetch('http://localhost:3000/api/descriptions/generate-from-data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    plantName: 'Al Dhafrah PV2 plant',
    plantType: 'Battery',
    configuration: {
      power: 'Nuclear',
      solar: 'PV'
    }
  })
});
`;

  console.log(code);
}

// Run tests
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--help')) {
    console.log('Usage: npx ts-node test-descriptions.ts [options]');
    console.log('\nOptions:');
    console.log('  --api         Test API generation endpoint');
    console.log('  --data        Test data generation endpoint');
    console.log('  --batch       Test batch generation');
    console.log('  --all         Run all tests (default)');
    console.log('  --example     Show usage examples');
    process.exit(0);
  }

  if (args.includes('--example')) {
    exampleUsage();
  } else if (args.includes('--api')) {
    testGenerateFromApi({});
  } else if (args.includes('--data')) {
    testGenerateFromData({});
  } else if (args.includes('--batch')) {
    testBatchGenerateDescriptions(['30', '31', '32']);
  } else {
    runAllTests();
  }
}

export { testGenerateFromApi, testGenerateFromData, testBatchGenerateDescriptions };
