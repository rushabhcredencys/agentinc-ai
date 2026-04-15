import { Router, Request, Response } from 'express';
import axios from 'axios';
import logger from '../utils/logger';
import { generateDescriptionFromPlant, ModelType } from '../utils/claudeDescriptionGenerator';
import { ApiResponse } from '../types/index';

const router = Router();

interface GenerateDescriptionRequest {
  apiEndpoint: string;
  model?: ModelType;
}

interface PlantData {
  errors: boolean;
  success: boolean;
  data: {
    id: number;
    key: string;
    attributes?: {
      PlantName?: string;
      plantType?: string;
      configurationPower?: string;
      configurationSolar?: string;
      configurationBattery?: string;
      configurationWater?: string;
      ContractPeriod?: string[];
      [key: string]: any;
    };
  };
}

/**
 * Generate product description from plant API data
 * POST /api/descriptions/generate
 * Body: { apiEndpoint: string, plantId: string, model?: 'claude' | 'gemini' }
 * Returns: { shortDescription, longDescription, keyFeatures, plantData, model }
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { apiEndpoint, model } = req.body as GenerateDescriptionRequest;

    if (!apiEndpoint) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: apiEndpoint',
        timestamp: new Date(),
      });
    }

    logger.info(`Fetching plant data from: ${apiEndpoint}`);

    // Fetch plant data from the provided API endpoint
    const plantResponse = await axios.get<PlantData>(apiEndpoint, {
      timeout: 10000,
      validateStatus: (status) => status < 500,
    });

    if (!plantResponse.data.success || plantResponse.data.errors) {
      return res.status(400).json({
        success: false,
        error: 'Failed to fetch plant data from API',
        apiError: plantResponse.data,
        timestamp: new Date(),
      });
    }

    const plantData = plantResponse.data.data;
    const attributes = plantData.attributes || {};

    logger.info(`Successfully fetched plant: ${plantData.key}`);

    // Generate description using specified model (default: claude)
    const description = await generateDescriptionFromPlant({
      plantName: attributes.PlantName || plantData.key || 'Unknown Plant',
      plantType: attributes.plantType,
      configuration: {
        power: attributes.configurationPower,
        solar: attributes.configurationSolar,
        battery: attributes.configurationBattery,
        water: attributes.configurationWater,
      },
      contractPeriod: attributes.ContractPeriod,
      attributes,
      model: model || 'claude',
    });

    const response: ApiResponse<any> = {
      success: true,
      data: {
        plantId: plantData.id,
        plantName: plantData.key,
        description,
        plantData: {
          type: attributes.plantType,
          configuration: {
            power: attributes.configurationPower,
            solar: attributes.configurationSolar,
            battery: attributes.configurationBattery,
            water: attributes.configurationWater,
          },
          contractPeriod: attributes.ContractPeriod,
        },
      },
      timestamp: new Date(),
    };

    return res.json(response);
  } catch (error) {
    logger.error(`Error in description generation: ${error}`);

    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const responseData = error.response?.data;
      
      return res.status(502).json({
        success: false,
        error: 'Failed to fetch from external API',
        details: error.message,
        apiStatus: statusCode,
        url: error.config?.url,
        apiResponse: statusCode && statusCode >= 400 ? responseData : undefined,
        timestamp: new Date(),
      });
    }

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      timestamp: new Date(),
    });
  }
});

/**
 * Generate description from raw plant data (no API call required)
 * POST /api/descriptions/generate-from-data
 * Body: { plantName, plantType, attributes, contractPeriod, configuration, model?: 'claude' | 'gemini' }
 * Returns: { shortDescription, longDescription, keyFeatures, model }
 */
router.post('/generate-from-data', async (req: Request, res: Response) => {
  try {
    const { plantName, plantType, attributes, contractPeriod, configuration, model } =
      req.body;

    if (!plantName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: plantName',
        timestamp: new Date(),
      });
    }

    logger.info(`Generating description for plant: ${plantName} using ${model || 'claude'}`);

    const description = await generateDescriptionFromPlant({
      plantName,
      plantType,
      attributes,
      contractPeriod,
      configuration,
      model: model || 'claude',
    });

    const response: ApiResponse<any> = {
      success: true,
      data: description,
      timestamp: new Date(),
    };

    return res.json(response);
  } catch (error) {
    logger.error(`Error generating description: ${error}`);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      timestamp: new Date(),
    });
  }
});

export default router;
