# Frontend Demo & Quick Start Guide

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
cd d:\Claude\AI_Agent\catalog-management-agent
npm install
```

### Step 2: Configure Environment
Create or update `.env` file:
```
NODE_ENV=development
PORT=3000

# Required: At least one API key
CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxxx
GEMINI_API_KEY=your-gemini-key-here

# Optional
DATABASE_URL=postgresql://localhost/catalog_agent_db
```

### Step 3: Build Project
```bash
npm run build
```

### Step 4: Start Server
```bash
npm start
```

You should see:
```
✓ Server running on port 3000
```

### Step 5: Open Frontend
Open your browser to:
```
http://localhost:3000
```

You should see the beautiful AI Description Generator interface! 🎉

---

## 🧪 Testing the Frontend

### Test 1: Generate from Raw Data (No API Required)

1. **URL**: http://localhost:3000
2. **Tab**: "💾 From Raw Data" (should be pre-selected)
3. **Fill Form**:
   - Plant Name: `Al Dhafrah PV2 plant`
   - Plant Type: `Battery`
   - Configuration Power: `Nuclear`
   - Configuration Solar: `PV`
   - Configuration Battery: `Other`
   - Model: `Claude 3.5 Sonnet` (default)
4. **Click**: "Generate Description"
5. **Wait**: 2-3 seconds for Claude or 1-2 seconds for Gemini
6. **Result**: Should see short/long descriptions and key features

**Expected Output**:
```
Short Description: "Advanced battery storage facility combining solar PV 
with nuclear power integration for enhanced grid stability."

Long Description: "Al Dhafrah PV2 plant is a cutting-edge energy storage 
facility that integrates battery technology with solar PV and nuclear power 
sources. Designed for reliable grid support, the facility combines multiple 
energy generation and storage capabilities..."

Key Features:
• Battery storage system
• Solar integration
• Nuclear power coupling
• Grid stability enhancement
```

### Test 2: Compare Models

1. **Generate with Claude** (see Test 1)
2. **Note** Model badge shows "🔵 Claude 3.5 Sonnet"
3. **Use Download**: Click "⬇️ Download JSON"
4. **Now Test Gemini**:
   - Select Model: "✨ Gemini 2.5 Flash"
   - Click "Generate Description"
5. **Compare** Results
6. **Note** Speed difference (Gemini faster)

### Test 3: Generate from API Endpoint (If API Available)

1. **Tab**: "📡 From API Endpoint"
2. **Fill Form**:
   - API Endpoint: `http://dev.ewec.local/get-plant?plantId=30`
   - Plant ID: `30`
   - Model: `Gemini 2.5 Flash`
3. **Click**: "Generate Description"
4. **Result**: Should show plant details from API + generated description + plant info section

### Test 4: Copy to Clipboard

1. Generate a description (any method)
2. Find the "📋 Copy" button
3. Click it
4. Paste somewhere (Ctrl+V)
5. Should see text was copied

### Test 5: Download Results

1. Generate a description
2. Click "⬇️ Download JSON"
   - File saved: `description.json`
3. Click "⬇️ Download Text"
   - File saved: `description.txt`

### Test 6: Error Handling

1. **Missing Plant Name**:
   - Click "Generate" without entering plant name
   - Should see error

2. **Invalid API Endpoint**:
   - Tab: "📡 From API Endpoint"
   - Endpoint: `http://invalid-url-12345.local`
   - Should show error after timeout

3. **Missing API Key**:
   - Remove API key from `.env`
   - Try to generate
   - Should show "is not configured" error

---

## 🎨 UI Features to Test

- ✅ Tab switching between input methods
- ✅ Form validation (required fields)
- ✅ Model selection with descriptions
- ✅ Loading spinner while generating
- ✅ Results display with animations
- ✅ Error messages
- ✅ Copy buttons
- ✅ Download options
- ✅ Responsive design (try resizing browser)
- ✅ Mobile view (F12 Dev Tools → Toggle Device Toolbar)

---

## 📊 Performance Testing

### Claude 3.5 Sonnet
- Expected time: 2-3 seconds
- Quality: Very High
- Cost: Higher

### Gemini 2.5 Flash
- Expected time: 1-2 seconds  
- Quality: High
- Cost: Lower

**Test**: Generate 5 descriptions with each model and average the times

---

## 🐛 Debugging

### Check Server Logs
```powershell
# Watch logs in real-time
# Logs show every request to the API
```

### Browser Console
```javascript
// Open: F12 → Console
// Check for any JavaScript errors
// Network tab shows API calls
```

### Test API Directly
```powershell
$body = @{
    plantName = "Test Plant"
    plantType = "Battery"
    model = "claude"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/descriptions/generate-from-data" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

---

## 📸 Screenshots

### Initial Screen
- Header with "AI Description Generator"
- Two tabs: "From API Endpoint" and "From Raw Data"
- Form with model selection
- Submit button

### After Generation
- Results section with smooth animation
- Model badge showing which AI was used
- Timestamp of generation
- Three sections: short description, long description, key features
- Download buttons
- Raw response viewer
- Copy buttons on each section

---

## 🚨 Common Issues & Solutions

### Port Already in Use
```bash
# Use different port
PORT=3001 npm start

# Or kill process using port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### API Key Not Found
```
Error: CLAUDE_API_KEY is not configured
```
**Solution**: 
- Ensure `.env` file exists
- Add valid API key
- Restart server

### "Generate" Button Disabled
- Check if any field is invalid
- Check browser console for errors
- Ensure API key is configured

### Slow Response on First Request
- First request may be slower (cold start)
- Subsequent requests are faster
- Normal behavior for cloud APIs

### No Results Appearing
- Check browser console (F12)
- Check server logs
- Try smaller request (raw data instead of API)

---

## ✅ Success Checklist

- [ ] Server starts without errors
- [ ] Frontend loads at http://localhost:3000
- [ ] Can enter plant name and generate description
- [ ] Results display with both models
- [ ] Can copy descriptions
- [ ] Can download JSON
- [ ] Can download Text
- [ ] Tab switching works
- [ ] Error handling works
- [ ] Mobile view is responsive

---

## 🎯 Next Steps

After successful testing:
1. **Deploy**: Move to production server
2. **Customize**: Modify CSS/HTML as needed
3. **Integrate**: Connect with other systems
4. **Monitor**: Track API usage and costs
5. **Batch Processing**: Add queue system for bulk operations

---

## 📚 File Structure

```
project/
├── src/
│   ├── routes/
│   │   └── descriptions.ts      (API endpoints)
│   └── utils/
│       └── claudeDescriptionGenerator.ts  (AI integration)
├── public/
│   ├── index.html              (Frontend UI)
│   ├── styles.css              (Styling)
│   ├── script.js               (JavaScript logic)
│   └── README.md               (Frontend docs)
└── dist/                       (Compiled JavaScript)
```

---

## 💡 Tips

1. **Bookmark**: Save `http://localhost:3000` for quick access
2. **API Key**: Keep multiple API keys for fallback
3. **Batch**: Use "From Raw Data" for testing without API
4. **Export**: Always export important descriptions
5. **Monitor**: Check server logs for performance insights

---

**Now you're ready to test the AI Description Generator! 🚀**

Open http://localhost:3000 in your browser and start generating descriptions!
