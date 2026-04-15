# Description Generation API Usage Guide

This document shows how to use the description generation feature to fetch plant data from an API endpoint and generate AI-powered descriptions using Claude or Gemini 2.5 Flash.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables in `.env`:
```
CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxxx
GEMINI_API_KEY=your-gemini-api-key-here
```

## API Endpoints

### 1. Generate Description from External API

**Endpoint:** `POST /api/descriptions/generate`

**Description:** Fetches plant data from an external API and generates a description using Claude or Gemini.

**Request Body:**
```json
{
  "apiEndpoint": "http://dev.ewec.local/get-plant?plantId=30",
  "plantId": "30",
  "model": "claude"
}
```

**Model Options:**
- `"claude"` - Uses Claude 3.5 Sonnet (default)
- `"gemini"` - Uses Gemini 2.5 Flash

**Example using curl (Claude):**
```bash
curl -X POST http://localhost:3000/api/descriptions/generate \
  -H "Content-Type: application/json" \
  -d '{
    "apiEndpoint": "http://dev.ewec.local/get-plant?plantId=30",
    "plantId": "30",
    "model": "claude"
  }'
```

**Example using curl (Gemini):**
```bash
curl -X POST http://localhost:3000/api/descriptions/generate \
  -H "Content-Type: application/json" \
  -d '{
    "apiEndpoint": "http://dev.ewec.local/get-plant?plantId=30",
    "plantId": "30",
    "model": "gemini"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "plantId": 30,
    "plantName": "Al Dhafrah PV2 plant",
    "description": {
      "shortDescription": "Advanced battery storage facility with solar and nuclear integration...",
      "longDescription": "Al Dhafrah PV2 plant is an innovative energy storage facility combining battery technology...",
      "keyFeatures": [
        "Battery storage system",
        "Solar integration",
        "Nuclear power integration",
        "Contract-based operations"
      ],
      "confidence": 0.9,
      "model": "claude",
      "generatedAt": "2026-04-15T10:30:00.000Z"
    },
    "plantData": {
      "type": "Battery",
      "configuration": {
        "power": "Nuclear",
        "solar": "PV",
        "battery": "Other",
        "water": ""
      },
      "contractPeriod": ["2025-06-30T18:30:00.000000Z", "2025-07-15T18:30:00.000000Z"]
    }
  },
  "timestamp": "2026-04-15T10:30:00.000Z"
}
```

**Error Response (502):**
```json
{
  "success": false,
  "error": "Failed to fetch from external API",
  "details": "Error message details",
  "timestamp": "2026-04-15T10:30:00.000Z"
}
```

---

### 2. Generate Description from Raw Data

**Endpoint:** `POST /api/descriptions/generate-from-data`

**Description:** Generates a description directly from provided plant data without needing to call an external API.

**Request Body:**
```json
{
  "plantName": "Al Dhafrah PV2 plant",
  "plantType": "Battery",
  "configuration": {
    "power": "Nuclear",
    "solar": "PV",
    "battery": "Other"
  },
  "contractPeriod": [
    "2025-06-30T18:30:00.000000Z",
    "2025-07-15T18:30:00.000000Z"
  ],
  "attributes": {
    "PlantName": "Al Dhafrah PV2 plant",
    "plantType": "Battery"
  },
  "model": "gemini"
}
```

**Example using curl:**
```bash
curl -X POST http://localhost:3000/api/descriptions/generate-from-data \
  -H "Content-Type: application/json" \
  -d '{
    "plantName": "Al Dhafrah PV2 plant",
    "plantType": "Battery",
    "configuration": {
      "power": "Nuclear",
      "solar": "PV",
      "battery": "Other"
    },
    "model": "gemini"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "shortDescription": "Advanced battery storage facility with multi-technology integration.",
    "longDescription": "Advanced battery storage facility with multi-technology integration, combining solar PV and nuclear power sources...",
    "keyFeatures": [
      "Battery storage system",
      "Solar integration",
      "Nuclear power coupling",
      "High-efficiency operations"
    ],
    "confidence": 0.9,
    "model": "gemini",
    "generatedAt": "2026-04-15T10:30:00.000Z"
  },
  "timestamp": "2026-04-15T10:30:00.000Z"
}
```

---

## Model Comparison

| Feature | Claude 3.5 Sonnet | Gemini 2.5 Flash |
|---------|------------------|------------------|
| Speed | ~2-3 seconds | ~1-2 seconds |
| Quality | Excellent | Excellent |
| Cost | Higher | Lower |
| Context Window | 200K tokens | 1M tokens |

---

## Example Workflows

### Workflow 1: Simple API Data Fetch & Generate Description (Claude)

```bash
#!/bin/bash

API_ENDPOINT="http://dev.ewec.local/get-plant?plantId=30"
GENERATOR_URL="http://localhost:3000/api/descriptions/generate"

curl -X POST "$GENERATOR_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"apiEndpoint\": \"$API_ENDPOINT\",
    \"plantId\": \"30\",
    \"model\": \"claude\"
  }"
```

### Workflow 2: Compare Models - Fetch from Both

```bash
#!/bin/bash

API_ENDPOINT="http://dev.ewec.local/get-plant?plantId=30"
GENERATOR_URL="http://localhost:3000/api/descriptions/generate"

echo "=== Claude 3.5 Sonnet ==="
curl -X POST "$GENERATOR_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"apiEndpoint\": \"$API_ENDPOINT\",
    \"plantId\": \"30\",
    \"model\": \"claude\"
  }"

echo -e "\n\n=== Gemini 2.5 Flash ==="
curl -X POST "$GENERATOR_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"apiEndpoint\": \"$API_ENDPOINT\",
    \"plantId\": \"30\",
    \"model\": \"gemini\"
  }"
```

### Workflow 3: Batch Generate Descriptions with Model Selection

```bash
#!/bin/bash

for plant_id in 30 31 32 33; do
  API_ENDPOINT="http://dev.ewec.local/get-plant?plantId=$plant_id"
  MODEL=${1:-"claude"}  # Default to claude, or pass model as argument
  
  curl -X POST "http://localhost:3000/api/descriptions/generate" \
    -H "Content-Type: application/json" \
    -d "{
      \"apiEndpoint\": \"$API_ENDPOINT\",
      \"plantId\": \"$plant_id\",
      \"model\": \"$MODEL\"
    }" | jq '.data.description'
done

# Usage: ./script.sh gemini
```

---

## PowerShell Examples

### Generate Single Description (Claude):
```powershell
$body = @{
    apiEndpoint = "http://dev.ewec.local/get-plant?plantId=30"
    plantId = "30"
    model = "claude"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/descriptions/generate" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

### Generate Single Description (Gemini):
```powershell
$body = @{
    apiEndpoint = "http://dev.ewec.local/get-plant?plantId=30"
    plantId = "30"
    model = "gemini"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/descriptions/generate" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

### Generate Descriptions in Batch with Model Selection:
```powershell
$plantIds = @(30, 31, 32, 33)
$model = "claude"  # Change to "gemini" to use Gemini

foreach ($plantId in $plantIds) {
    $body = @{
        apiEndpoint = "http://dev.ewec.local/get-plant?plantId=$plantId"
        plantId = "$plantId"
        model = $model
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/descriptions/generate" `
      -Method POST `
      -ContentType "application/json" `
      -Body $body

    $data = $response.Content | ConvertFrom-Json
    Write-Host "Plant $plantId ($model): $($data.data.description.shortDescription)"
}
```

---

## Error Handling

### Missing Required Fields:
```json
{
  "success": false,
  "error": "Missing required fields: apiEndpoint, plantId",
  "timestamp": "2026-04-15T10:30:00.000Z"
}
```

### API Fetch Failure:
```json
{
  "success": false,
  "error": "Failed to fetch plant data from API",
  "apiError": {
    "errors": true,
    "success": false
  },
  "timestamp": "2026-04-15T10:30:00.000Z"
}
```

### Missing API Key for Selected Model:
```json
{
  "success": false,
  "error": "CLAUDE_API_KEY is not configured",
  "timestamp": "2026-04-15T10:30:00.000Z"
}
```

```json
{
  "success": false,
  "error": "GEMINI_API_KEY is not configured",
  "timestamp": "2026-04-15T10:30:00.000Z"
}
```

---

## Notes

- Default model is Claude if not specified
- Generated descriptions include short and long versions for flexible use
- Confidence level is set to 0.9 for both AI models
- API calls have a 10-second timeout
- All timestamps are in ISO 8601 format
- Model used is included in response for reference
