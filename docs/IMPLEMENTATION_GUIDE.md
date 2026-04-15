# Description Generation Implementation Guide

## Overview

This implementation adds AI-powered description generation to the catalog management agent. It fetches product/plant data from an external API and generates professional descriptions using either Claude 3.5 Sonnet or Gemini 2.5 Flash (user selectable).

## What Was Implemented

### 1. **New Dependencies**
- Added `@anthropic-ai/sdk` to generate descriptions using Claude

### 2. **Environment Configuration**
- Extended `src/config/env.ts` to include `CLAUDE_API_KEY`
- Updated `.env.example` with CLAUDE_API_KEY placeholder

### 3. **Core Utilities**
- Created `src/utils/claudeDescriptionGenerator.ts`
  - `generateDescriptionFromPlant()` - Main function to generate descriptions
  - Accepts plant data with name, type, configuration, and attributes
  - Returns structured response with short/long descriptions and key features
  - Built-in error handling and response parsing

### 4. **New API Routes**
- Created `src/routes/descriptions.ts` with two endpoints:

#### Endpoint 1: `/api/descriptions/generate` (POST)
**Purpose:** Fetch plant data from external API and generate description
```bash
curl -X POST http://localhost:3000/api/descriptions/generate \
  -H "Content-Type: application/json" \
  -d '{
    "apiEndpoint": "http://dev.ewec.local/get-plant?plantId=30",
    "plantId": "30"
  }'
```

#### Endpoint 2: `/api/descriptions/generate-from-data` (POST)
**Purpose:** Generate description from provided plant data (no API call)
```bash
curl -X POST http://localhost:3000/api/descriptions/generate-from-data \
  -H "Content-Type: application/json" \
  -d '{
    "plantName": "Al Dhafrah PV2 plant",
    "plantType": "Battery",
    "configuration": {
      "power": "Nuclear",
      "solar": "PV"
    }
  }'
```

### 5. **Integration**
- Updated `src/index.ts` to:
  - Import description routes
  - Register `/api/descriptions` endpoint
  - Document new endpoints in root API response

### 6. **Documentation & Tests**
- Created `docs/DESCRIPTION_GENERATION.md` - Complete usage guide
- Created `src/tests/test-descriptions.ts` - Comprehensive test examples

## How to Use

### Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
# Copy and edit .env with your Claude API key
cp .env.example .env
# Edit .env and set:
# CLAUDE_API_KEY=sk-ant-xxxxx
```

3. **Build and run:**
```bash
npm run build
npm start
```

### Making API Calls

#### From External API:
```typescript
const response = await fetch('http://localhost:3000/api/descriptions/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    apiEndpoint: 'http://dev.ewec.local/get-plant?plantId=30',
    plantId: '30'
  })
});
```

#### From Raw Data:
```typescript
const response = await fetch('http://localhost:3000/api/descriptions/generate-from-data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    plantName: 'Al Dhafrah PV2 plant',
    plantType: 'Battery',
    configuration: {
      power: 'Nuclear',
      solar: 'PV',
      battery: 'Other'
    }
  })
});
```

## Response Format

### Success Response:
```json
{
  "success": true,
  "data": {
    "plantId": 30,
    "plantName": "Al Dhafrah PV2 plant",
    "description": {
      "shortDescription": "Advanced battery storage facility...",
      "longDescription": "Al Dhafrah PV2 plant is an innovative energy storage facility...",
      "keyFeatures": ["Battery storage", "Solar integration", "Nuclear coupling"],
      "confidence": 0.9,
      "generatedAt": "2026-04-15T10:30:00.000Z"
    }
  },
  "timestamp": "2026-04-15T10:30:00.000Z"
}
```

## Features

✅ **AI-Powered Descriptions** - Uses Claude 3.5 Sonnet for high-quality text
✅ **Flexible Input** - Accept data from external APIs or direct input
✅ **Structured Output** - Returns short/long descriptions + key features
✅ **Error Handling** - Comprehensive error messages for API failures
✅ **Logging** - Full request/response logging via Pino logger
✅ **Type Safety** - Full TypeScript support with interfaces
✅ **Timeout Protection** - 10-second timeout on external API calls

## Files Modified/Created

### Modified:
- `package.json` - Added @anthropic-ai/sdk dependency
- `src/config/env.ts` - Added CLAUDE_API_KEY config
- `src/index.ts` - Registered description routes
- `.env.example` - Added CLAUDE_API_KEY placeholder

### Created:
- `src/utils/claudeDescriptionGenerator.ts` - Claude integration utility
- `src/routes/descriptions.ts` - API endpoints
- `src/tests/test-descriptions.ts` - Test examples
- `docs/DESCRIPTION_GENERATION.md` - Complete documentation

## Testing

Run the test file:
```bash
# Test all endpoints
npm run dev  # Start server in another terminal
npx ts-node src/tests/test-descriptions.ts

# Test specific endpoint
npx ts-node src/tests/test-descriptions.ts --api
npx ts-node src/tests/test-descriptions.ts --data

# Show usage examples
npx ts-node src/tests/test-descriptions.ts --example
```

## Example Workflow

```bash
#!/bin/bash
# 1. Install and build
npm install
npm run build

# 2. Start server
npm start &

# 3. Wait for server to start
sleep 3

# 4. Call description generation API
curl -X POST http://localhost:3000/api/descriptions/generate \
  -H "Content-Type: application/json" \
  -d '{
    "apiEndpoint": "http://dev.ewec.local/get-plant?plantId=30",
    "plantId": "30"
  }'

# 5. Output will include AI-generated descriptions
```

## Next Steps

- Integrate with a frontend/UI for easier interaction
- Add database storage for generated descriptions (caching)
- Implement batch processing for multiple plants
- Add analytics to track description quality
- Extend to support other LLM providers (fallback options)

## Support

For issues or questions:
1. Check `docs/DESCRIPTION_GENERATION.md` for detailed API documentation
2. Review `src/tests/test-descriptions.ts` for code examples
3. Ensure CLAUDE_API_KEY is properly configured
4. Check logs for detailed error messages
