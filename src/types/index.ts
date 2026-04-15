// Product Types
export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category?: string;
  attributes?: Record<string, any>;
  images?: string[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export interface Classification {
  categoryPath: string;
  confidence: number;
  top3Candidates: Array<{ category: string; confidence: number }>;
  model: string;
  timestamp: Date;
}

export interface Tag {
  name: string;
  value: string;
  confidence: number;
  source: 'image' | 'description' | 'manual';
}

export interface ImageSequence {
  url: string;
  type: 'hero' | 'lifestyle' | 'detail' | 'swatch' | 'packaging' | 'manual';
  position: number;
  confidence: number;
}

export interface DataQualityScore {
  completenessScore: number; // 0-100
  missingFields: string[];
  recommendedActions: string[];
  lastChecked: Date;
}

// Agent Types
export interface AgentTask {
  id: string;
  type: 'classify' | 'tag' | 'sequence_images' | 'check_quality' | 'bulk_update';
  productIds: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  confidence?: number;
  approvalRequired: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  result?: any;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface AgentChange {
  id: string;
  productId: string;
  field: string;
  oldValue: any;
  newValue: any;
  actor: 'agent' | 'human';
  confidence?: number;
  reason?: string;
  timestamp: Date;
  version: number;
}

// Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}
