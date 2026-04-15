# AI Description Generator Frontend

A modern, user-friendly web interface for generating plant/product descriptions using Claude or Gemini AI models.

## 🚀 Features

- **Dual Model Support**: Choose between Claude 3.5 Sonnet or Gemini 2.5 Flash
- **Two Input Methods**:
  - Fetch from external API endpoint directly
  - Generate from raw JSON data
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Real-time Results**: Instant description generation
- **Export Options**: Download results as JSON or formatted text
- **Model Comparison**: See which model generated each description
- **Copy to Clipboard**: Easily copy individual sections
- **Mobile Friendly**: Fully responsive design

## 🛠️ Setup

No additional setup needed! The frontend is automatically served when you start the server.

### Prerequisites
- Backend server running on `http://localhost:3000`
- Both API keys configured (or at least one):
  - `CLAUDE_API_KEY` (for Claude model)
  - `GEMINI_API_KEY` (for Gemini model)

### Starting the Server

```bash
# Build the project
npm run build

# Start the server
npm start
```

Then open your browser to: `http://localhost:3000`

## 📖 Usage

### Method 1: Generate from API Endpoint

1. **Select Tab**: Click "📡 From API Endpoint"
2. **Enter API Endpoint URL**: 
   ```
   http://dev.ewec.local/get-plant?plantId=30
   ```
3. **Enter Plant ID**: `30`
4. **Choose Model**:
   - 🔵 Claude 3.5 Sonnet (High quality, slower, higher cost)
   - ✨ Gemini 2.5 Flash (Fast, lower cost)
5. **Click Generate**: Wait for the AI to generate descriptions
6. **View Results**: See short description, long description, and key features

### Method 2: Generate from Raw Data

1. **Select Tab**: Click "💾 From Raw Data"
2. **Enter Plant Information**:
   - Plant Name (required)
   - Plant Type (optional)
   - Configuration options (Power, Solar, Battery, Water)
3. **Choose Model**
4. **Click Generate**
5. **View Results**

## 📊 Output Sections

### Short Description
A concise 1-2 sentence summary (max 120 characters)

### Long Description
A comprehensive 3-4 sentence description highlighting key features and benefits

### Key Features
Bullet points listing 3-4 main characteristics of the plant

### Plant Information (API method only)
Details extracted from the API response including type and configuration

### Download Options

**Download as JSON**
```json
{
  "plantId": 30,
  "plantName": "Al Dhafrah PV2 plant",
  "description": {
    "shortDescription": "...",
    "longDescription": "...",
    "keyFeatures": [...],
    "model": "claude",
    "generatedAt": "..."
  }
}
```

**Download as Text**
Formatted text document with all descriptions and features

## 🎯 Model Selection Guide

### Choose Claude 3.5 Sonnet when:
- You need highest quality descriptions
- Writing style and nuance matter
- Budget is not a constraint
- Speed is less critical

### Choose Gemini 2.5 Flash when:
- You need fast results
- Processing many plants (cost-effective)
- Good-quality descriptions are sufficient
- Bulk processing scenarios

## 🔧 API Integration

The frontend communicates with two backend endpoints:

### POST `/api/descriptions/generate`
**Fetch from API and generate**
```javascript
{
  "apiEndpoint": "http://...",
  "plantId": "30",
  "model": "claude" // or "gemini"
}
```

### POST `/api/descriptions/generate-from-data`
**Generate from raw data**
```javascript
{
  "plantName": "Plant Name",
  "plantType": "Battery",
  "configuration": {
    "power": "Nuclear",
    "solar": "PV",
    "battery": "Other"
  },
  "model": "gemini"
}
```

## 🚨 Troubleshooting

### Error: "CLAUDE_API_KEY is not configured"
- Set `CLAUDE_API_KEY` in your `.env` file
- Restart the server

### Error: "GEMINI_API_KEY is not configured"
- Set `GEMINI_API_KEY` in your `.env` file
- Restart the server

### Error: "Failed to fetch from external API"
- Check the API endpoint URL is correct
- Verify the endpoint is accessible from your network
- Check plant ID is valid

### Slow Response
- This is normal - Claude takes 2-3 seconds
- Gemini is faster at 1-2 seconds
- Network latency may add additional time

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 Customization

The frontend is located in:
- `public/index.html` - HTML structure
- `public/styles.css` - Styling
- `public/script.js` - Functionality

Edit these files to customize appearance and behavior.

## 💡 Tips & Tricks

- **Copy Results**: Click the "📋 Copy" button on any section to copy to clipboard
- **View Raw**: Click the "📊 View Raw Response" details to see full API response
- **Quick Export**: Quickly download results as JSON or text
- **Tab Switching**: Easily switch between API and raw data input modes
- **Real-time Feedback**: Error messages appear instantly for quick troubleshooting

## 📝 Example Workflow

```
1. Open http://localhost:3000
2. Keep "📡 From API Endpoint" tab selected
3. Enter: http://dev.ewec.local/get-plant?plantId=30
4. Plant ID: 30
5. Select Model: Gemini 2.5 Flash (for speed)
6. Click "Generate Description"
7. Wait 1-2 seconds for results
8. Click "⬇️ Download JSON" to save
9. Share or use the descriptions
```

## 🔐 Security

- All API keys are stored on the backend
- Frontend only sends endpoint URLs and plant IDs
- HTTPS recommended for production
- No sensitive data stored in browser

## 📞 Support

For issues:
1. Check the error message displayed
2. Ensure API keys are configured
3. Verify API endpoint is accessible
4. Check browser console for detailed errors
5. Review server logs for backend issues

---

**Version**: 1.0.0  
**Last Updated**: April 15, 2026
