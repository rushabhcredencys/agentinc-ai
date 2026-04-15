let currentResponse = null;
let currentPimcoreJson = null;

// ─── Agent definitions ───────────────────────────────────
const AGENTS = {
  description:    { icon: '📝', name: 'Product Description Generator', active: true },
  tagging:        { icon: '🏷️', name: 'Auto Product Tagging',          active: false },
  classification: { icon: '🗂️', name: 'Auto Classification',           active: false },
  sequencing:     { icon: '🎬', name: 'Image Sequencing',               active: false },
  'image-quality':{ icon: '✨', name: 'Image Quality Enhancement',      active: false },
  'image-to-data':{ icon: '📷', name: 'Image-to-Product Data',          active: false },
  enrichment:     { icon: '💎', name: 'Product Data Enrichment',        active: false },
  commerce:       { icon: '🛒', name: 'Agentic Commerce',               active: false },
};

// Agent card selection
document.querySelectorAll('.agent-card').forEach((card) => {
  card.addEventListener('click', () => {
    const agentKey = card.dataset.agent;

    // Update active card
    document.querySelectorAll('.agent-card').forEach((c) => c.classList.remove('active'));
    card.classList.add('active');

    // Hide results when switching agents
    document.getElementById('results').classList.add('hidden');
    hideError();

    const agent = AGENTS[agentKey];
    if (agent?.active) {
      document.getElementById('panel-description').classList.remove('hidden');
      document.getElementById('panel-coming-soon').classList.add('hidden');
    } else {
      document.getElementById('panel-description').classList.add('hidden');
      const csPanel = document.getElementById('panel-coming-soon');
      csPanel.classList.remove('hidden');
      document.getElementById('csIcon').textContent  = agent?.icon || '🚧';
      document.getElementById('csTitle').textContent = agent?.name || 'Coming Soon';
    }
  });
});

// Model card visual selection
document.querySelectorAll('.model-radio').forEach((radio) => {
  radio.addEventListener('change', () => {
    document.querySelectorAll('.model-option').forEach((opt) => opt.classList.remove('selected'));
    radio.closest('.model-option').classList.add('selected');
  });
});

// API Endpoint Form
document.getElementById('apiForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const apiUrl = document.getElementById('apiUrl').value;
  const model = document.querySelector('input[name="model"]:checked').value;

  await generateFromApi(apiUrl, model);
});

async function generateFromApi(apiUrl, model) {
  const btn = document.getElementById('generateBtn');

  try {
    btn.disabled = true;
    hideError();

    const response = await fetch('/api/descriptions/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiEndpoint: apiUrl, model }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Failed to generate description');

    currentResponse = data.data;
    displayResults(data.data);
  } catch (error) {
    showError(error.message);
  } finally {
    btn.disabled = false;
  }
}

function buildPimcoreJson(data) {
  const desc = data.description || data;
  const plantData = data.plantData || {};
  const config = plantData.configuration || {};

  const obj = {
    key: data.plantName || String(data.plantId || ''),
    shortDescription: desc.shortDescription || '',
    longDescription: desc.longDescription || '',
    keyFeatures: desc.keyFeatures || [],
    plantType: plantData.type || '',
    configuration: {
      power:   config.power   || '',
      solar:   config.solar   || '',
      battery: config.battery || '',
      water:   config.water   || '',
    },
    _meta: {
      aiModel:     desc.model || 'claude',
      generatedAt: desc.generatedAt || new Date().toISOString(),
    },
  };

  // Strip empty configuration values
  Object.keys(obj.configuration).forEach((k) => {
    if (!obj.configuration[k]) delete obj.configuration[k];
  });
  if (!Object.keys(obj.configuration).length) delete obj.configuration;

  return obj;
}

function displayResults(data) {
  const desc = data.description || data;

  // Build and store Pimcore JSON
  currentPimcoreJson = buildPimcoreJson(data);
  const jsonStr = JSON.stringify(currentPimcoreJson, null, 2);

  // Render syntax-highlighted JSON
  document.getElementById('jsonOutput').innerHTML = syntaxHighlight(jsonStr);

  // Model badge
  const isGemini = desc.model === 'gemini';
  const modelBadge = document.getElementById('modelBadge');
  modelBadge.textContent = isGemini ? '✨ Gemini 2.5 Flash' : '🔵 Claude 3.5 Sonnet';
  modelBadge.className = `badge ${isGemini ? 'gemini' : 'claude'}`;

  // Timestamp
  const date = new Date(desc.generatedAt || new Date());
  document.getElementById('timestamp').textContent = `Generated: ${date.toLocaleString()}`;

  // Show results
  const resultsSection = document.getElementById('results');
  resultsSection.classList.remove('hidden');
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function syntaxHighlight(json) {
  return json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = 'jn'; // number
        if (/^"/.test(match)) {
          cls = /:$/.test(match) ? 'jk' : 'js'; // key or string
        } else if (/true|false/.test(match)) {
          cls = 'jb'; // boolean
        } else if (/null/.test(match)) {
          cls = 'jnull';
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
}

function copyJson(btn) {
  if (!currentPimcoreJson) return;
  navigator.clipboard.writeText(JSON.stringify(currentPimcoreJson, null, 2)).then(() => {
    const original = btn.innerHTML;
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="width:13px;height:13px"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
    btn.classList.add('copied');
    setTimeout(() => {
      btn.innerHTML = original;
      btn.classList.remove('copied');
    }, 2000);
  });
}

function exportToExcel() {
  if (!currentPimcoreJson) return;

  const p = currentPimcoreJson;
  const config = p.configuration || {};

  // Flat row for Pimcore DataObject import
  const row = {
    key:                  p.key,
    shortDescription:     p.shortDescription,
    longDescription:      p.longDescription,
    keyFeatures:          (p.keyFeatures || []).join('; '),
    plantType:            p.plantType || '',
    configurationPower:   config.power   || '',
    configurationSolar:   config.solar   || '',
    configurationBattery: config.battery || '',
    configurationWater:   config.water   || '',
    aiModel:              p._meta?.aiModel || '',
    generatedAt:          p._meta?.generatedAt || '',
  };

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet([row]);

  // Column widths
  ws['!cols'] = [
    { wch: 25 }, // key
    { wch: 60 }, // shortDescription
    { wch: 80 }, // longDescription
    { wch: 80 }, // keyFeatures
    { wch: 20 }, // plantType
    { wch: 22 }, // configurationPower
    { wch: 22 }, // configurationSolar
    { wch: 22 }, // configurationBattery
    { wch: 22 }, // configurationWater
    { wch: 15 }, // aiModel
    { wch: 28 }, // generatedAt
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Pimcore Import');
  XLSX.writeFile(wb, 'pimcore-import.xlsx');
}

function downloadAsJSON() {
  if (!currentPimcoreJson) return;
  downloadFile(
    new Blob([JSON.stringify(currentPimcoreJson, null, 2)], { type: 'application/json' }),
    'pimcore-import.json'
  );
}

function showError(message) {
  document.getElementById('errorMessage').textContent = message;
  document.getElementById('error').classList.remove('hidden');
}

function hideError() {
  document.getElementById('error').classList.add('hidden');
}

document.getElementById('closeError').addEventListener('click', hideError);
document.getElementById('closeResults').addEventListener('click', () => {
  document.getElementById('results').classList.add('hidden');
});

function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
