# Agent-001: Catalog Management Agent - Quick Reference

## Agent Identity
| Property | Value |
|----------|-------|
| **ID** | Agent-001 |
| **Name** | Catalog Management Agent |
| **Type** | Autonomous Product Metadata Manager |
| **Status** | Specification (Ready for Development) |
| **Total Tasks** | 16 (7 High, 6 Medium, 3 Low) |
| **Timeline** | ~13 weeks (3 months) |

---

## Agent Capabilities (Tools)

### 🏷️ **classify_product** (AI Tool)
Automatically categorizes products into taxonomies.
```json
{
  "inputs": {
    "product_attributes": "object",
    "description": "string",
    "image_url": "string (optional)"
  },
  "outputs": {
    "category_path": "string (GS1/eCl@ss/custom)",
    "confidence": "number (0-1)",
    "top_3_candidates": "array"
  },
  "latency_sla": "< 2 seconds",
  "confidence_thresholds": {
    "auto_approve": "> 80%",
    "require_review": "60-80%",
    "always_defer": "< 60%"
  }
}
```

### 🏷️ **tag_product** (AI Tool)
Extracts attributes from images and descriptions.
```json
{
  "inputs": {
    "description": "string",
    "image_urls": "array",
    "attribute_schema": "object",
    "batch_mode": "boolean (optional)"
  },
  "outputs": {
    "tags": [
      { "name": "string", "value": "string", "confidence": "number" }
    ]
  },
  "latency_sla": "< 5 seconds for batch of 10",
  "batch_support": true,
  "max_batch_size": 100
}
```

### 🖼️ **sequence_images** (AI Tool)
Intelligently orders product images by type and category.
```json
{
  "inputs": {
    "product_id": "string",
    "image_urls": "array",
    "category": "string",
    "marketplace": "string"
  },
  "outputs": {
    "ordered_images": [
      { "url": "string", "type": "string", "position": "number", "confidence": "number" }
    ]
  },
  "image_types": ["hero", "lifestyle", "detail", "swatch", "packaging", "manual"],
  "latency_sla": "< 3 seconds",
  "marketplace_specific": true
}
```

### 📊 **check_data_quality** (Backend Tool)
Scores completeness and identifies missing fields.
```json
{
  "inputs": {
    "product_id_or_category": "string",
    "scope": "single|category"
  },
  "outputs": {
    "completeness_score": "number (0-100)",
    "missing_fields": ["string"],
    "recommended_actions": ["string"]
  },
  "latency_sla": "< 500ms",
  "uses_db_views": ["v_category_stats", "v_data_completeness", "v_missing_attributes"]
}
```

### 🔄 **bulk_update_products** (Backend Tool)
Applies updates to multiple products with approval gates.
```json
{
  "inputs": {
    "updates": [
      { "product_id": "string", "updates": "object" }
    ],
    "approval_threshold": "number (0-100 %)"
  },
  "outputs": {
    "job_id": "string",
    "estimated_time": "number (seconds)",
    "status_url": "string"
  },
  "requires_hitl": true,
  "async_processing": true,
  "rollback_capable": true
}
```

---

## Autonomous Workflows

### 1️⃣ **New Product Onboarding** (Event: product.created)
```
product.created event
  ├─→ classify_product()
  ├─→ tag_product()
  ├─→ generate_description()
  ├─→ sequence_images()
  ├─→ check_data_quality()
  └─→ Output: { ready_to_publish: bool, review_reason: string }

⏱️ Max timeout: 30 seconds
🚩 Flag for review if: completeness_score < 80%
```

### 2️⃣ **Daily Data Quality Patrol** (Scheduled: Daily)
```
Scheduled trigger (configurable time)
  ├─→ Scan catalog (sample or full)
  ├─→ Run check_data_quality() per product/category
  ├─→ Identify gaps: missing descriptions, untagged, unsequenced
  ├─→ Auto-trigger enrichment where possible
  └─→ Email daily summary report to managers

📋 Full audit log of all autonomous actions
```

### 3️⃣ **Conflict Handling** (When values differ)
```
Agent-suggested value ≠ Existing human value
  ├─→ Detect conflict
  ├─→ Compare confidence scores
  └─→ Apply resolution policy:
      ├─ defer: Keep human value, log for analysis
      ├─ flag_for_review: Show both options to manager
      └─ overwrite_if_confident: Auto-update if agent > threshold

📊 Track conflict patterns for model improvement
```

---

## REST API Endpoints

### Read Operations
```
GET  /api/products/:id                    # Fetch single product
GET  /api/products?filter[category]=X     # Query by category
GET  /api/products?bulk=true               # Bulk fetch (paginated)
GET  /api/products/stats                  # Category statistics
```

### Write Operations
```
POST   /api/products                      # Create new product
PATCH  /api/products/:id                  # Partial update
PUT    /api/products/:id                  # Full replace
```

### Agent Operations
```
POST  /api/agent/classify                 # Classify product
POST  /api/agent/tag                      # Tag product
POST  /api/agent/sequence-images          # Sequence images
POST  /api/agent/check-quality            # Check quality
POST  /api/agent/bulk-update              # Bulk operations
```

### Audit & History
```
GET   /api/products/:id/versions              # Version history
POST  /api/products/:id/rollback?version=N   # Rollback to version
GET   /api/audit/changes?from=DATE&to=DATE   # Change history
```

---

## Manager Interfaces

### 📊 **Dashboard** (C-13)
- Real-time activity feed
- KPI cards (products processed, quality improved, errors)
- Pending approvals queue
- Product audit trail (before/after views)
- Rollback controls
- Error log

### 💬 **Chat Interface** (C-14)
```
Manager: "Re-classify all products in the Outdoor category"
  ↓
Agent: Shows execution plan (# products, categories, confidence)
  ↓
Manager: Clicks "Approve"
  ↓
Agent: Executes in background, provides progress updates
  ↓
Summary: "100 products re-classified, 5 flagged for review"
```

### 📈 **Performance Reporting** (C-16)
- Classification accuracy rate
- Tagging precision / F1 score
- Data quality score delta (before/after)
- Onboarding time (P50, P95, P99)
- Exports: PDF, CSV, JSON
- Cohort analysis: by category, marketplace, time period

---

## Approval Rules (HITL Gates)

### Auto-Approve Scenarios ✅
- Single product classification, confidence > 80%
- Single product tagging, confidence > 60%
- Bulk update < 1000 products, avg confidence > 80%

### Require Human Review 🛑
- Confidence 60-80%
- Conflicts with existing human-assigned values
- Bulk operations 1000-10K products (any confidence)
- Operations > 10K products (require stakeholder sign-off)
- Any delete or permanent changes

### Never Auto-Approve ❌
- Delete operations
- Data migrations
- Schema changes
- Bulk operations exceeding threshold

---

## Performance Targets

| Metric | Target | Tool/Operation |
|--------|--------|-----------------|
| Product query | < 500ms | GET /api/products/:id |
| Classification | < 2s | classify_product() |
| Tagging (batch of 10) | < 5s | tag_product() |
| Image sequencing | < 3s | sequence_images() |
| Quality check | < 500ms | check_data_quality() |
| Daily patrol | < 2h window | Scheduled workflow |
| Classification accuracy | > 95% | High confidence only |
| Data quality improvement | +30% delta | Avg across onboarded |
| Autonomous completion | 80% | No human review needed |

---

## Data Quality Metrics (Dashboard)

```json
{
  "product_metrics": {
    "completeness_score": "0-100 (higher = better)",
    "missing_required_fields": "count",
    "images_sequenced": "bool",
    "description_present": "bool",
    "tags_count": "number",
    "classification_confidence": "0-100"
  },
  "category_metrics": {
    "avg_completeness": "number",
    "coverage_pct": "what % has been reviewed",
    "quality_trend": "improving | stable | declining"
  },
  "agent_metrics": {
    "tasks_completed": "count",
    "products_processed": "count",
    "errors": "count",
    "pending_approvals": "count",
    "rollback_rate": "% of changes rolled back"
  }
}
```

---

## Database Views (Phase 1)

```sql
-- Category statistics
SELECT * FROM v_category_stats;
-- Returns: category, product_count, avg_completeness, tags_coverage, images_sequenced

-- Data completeness by product
SELECT * FROM v_data_completeness;
-- Returns: product_id, completeness_score, category, last_updated

-- Missing attributes report
SELECT * FROM v_missing_attributes;
-- Returns: product_id, category, missing_fields[], action_recommended
```

---

## Tech Stack Summary

| Layer | Tech |
|-------|------|
| **Backend** | Node.js 18+, TypeScript, Express/Fastify, PostgreSQL 14+ |
| **AI/ML** | PyTorch, Hugging Face, CLIP, spaCy, MCP Protocol |
| **Frontend** | React 18, Redux, Tailwind CSS, Chart.js, Socket.io |
| **Infrastructure** | Docker, Kubernetes, Prometheus, ELK, GitHub Actions |
| **Queue** | RabbitMQ or Kafka (event streaming) |
| **Jobs** | Bull or Temporal (background jobs) |

---

## Project Phases

| Phase | Focus | Duration | Deliverables |
|-------|-------|----------|--------------|
| **1** | APIs & Database | 3 weeks | Read/write APIs, DB views, validation |
| **2** | AI Tools | 4 weeks | Classification, tagging, sequencing, quality tools |
| **3** | Automation | 3 weeks | System prompt, workflows, conflict logic |
| **4** | UI & Monitoring | 3 weeks | Dashboard, chat, rollback, reporting |

**Total: ~13 weeks (3 months)**

---

## Success Criteria

✅ Classification accuracy > 95% for high-confidence  
✅ Data quality delta +30% on average  
✅ 80% autonomous completion rate  
✅ 70% time savings for catalog managers  
✅ 0% false positives on quality alerts  
✅ < 5% rollback rate  
✅ 100% audit coverage  

---

## Key Constraints

⚠️ **Never** delete without explicit approval  
⚠️ **Never** overwrite human values without high confidence + approval  
⚠️ **Always** maintain immutable audit trail  
⚠️ **Require** human review for bulk operations > threshold  
⚠️ **Flag** all conflicts for manager review  

---

## Contact & Support

Questions? Reach out to the Product / Catalog Management team.

**Version**: 1.0.0 | **Updated**: April 14, 2026 | **Status**: Active Specification
