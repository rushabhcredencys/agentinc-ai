import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from './logger';
import config from '../config/env';

export type ModelType = 'claude' | 'gemini';

export interface DescriptionGeneratorInput {
  plantName: string;
  plantType?: string;
  attributes?: Record<string, any>;
  contractPeriod?: string[];
  configuration?: {
    water?: string;
    power?: string;
    solar?: string;
    battery?: string;
  };
  model?: ModelType;
}

export interface GeneratedDescription {
  shortDescription: string;
  longDescription: string;
  keyFeatures: string[];
  confidence: number;
  model: ModelType;
  generatedAt: Date;
}

/**
 * Generate AI-powered description for a plant product using Claude or Gemini
 * @param input Plant data to generate description from
 * @returns Generated description with metadata
 */
export async function generateDescriptionFromPlant(
  input: DescriptionGeneratorInput
): Promise<GeneratedDescription> {
  const model = input.model || 'claude';

  if (model === 'gemini') {
    return generateUsingGemini(input);
  } else {
    return generateUsingClaude(input);
  }
}

async function generateUsingClaude(
  input: DescriptionGeneratorInput
): Promise<GeneratedDescription> {
  try {
    if (!config.apis.claudeKey) {
      throw new Error('CLAUDE_API_KEY is not configured');
    }

    const client = new Anthropic({
      apiKey: config.apis.claudeKey,
    });

    const prompt = buildPrompt(input);

    logger.info(`Generating description using Claude for: ${input.plantName}`);

    const message = await (client as any).messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    const parsed = parseResponse(responseText);

    const result: GeneratedDescription = {
      shortDescription: parsed.shortDescription,
      longDescription: parsed.longDescription,
      keyFeatures: parsed.keyFeatures,
      confidence: 0.9,
      model: 'claude',
      generatedAt: new Date(),
    };

    logger.info(
      `Successfully generated description using Claude for: ${input.plantName}`
    );

    return result;
  } catch (error) {
    logger.error(`Error generating description with Claude: ${error}`);
    throw error;
  }
}

async function generateUsingGemini(
  input: DescriptionGeneratorInput
): Promise<GeneratedDescription> {
  try {
    if (!config.apis.geminiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const genAI = new GoogleGenerativeAI(config.apis.geminiKey);
    const prompt = buildPrompt(input);

    logger.info(`Generating description using Gemini for: ${input.plantName}`);

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await generateWithRetry(model, prompt, 'gemini-2.5-flash');

    const response = result.response;
    const responseText = response.text();

    const parsed = parseResponse(responseText);

    const result_description: GeneratedDescription = {
      shortDescription: parsed.shortDescription,
      longDescription: parsed.longDescription,
      keyFeatures: parsed.keyFeatures,
      confidence: 0.9,
      model: 'gemini',
      generatedAt: new Date(),
    };

    logger.info(
      `Successfully generated description using Gemini for: ${input.plantName}`
    );

    return result_description;
  } catch (error) {
    logger.error(`Error generating description with Gemini: ${error}`);
    throw error;
  }
}

/**
 * Generate content with retry logic for free tier rate limiting
 */
async function generateWithRetry(
  model: any,
  prompt: string,
  modelName: string,
  attempt = 1
): Promise<any> {
  try {
    return await model.generateContent(prompt);
  } catch (error: any) {
    const maxRetries = config.gemini.maxRetries;
    const isRateLimited = error?.status === 429;
    const isUnavailable = error?.status === 503;
    const isQuotaExceeded = error?.message?.includes('quota') || error?.message?.includes('high demand');
    const shouldRetry = (isRateLimited || isUnavailable || isQuotaExceeded) && attempt < maxRetries;

    if (shouldRetry) {
      // Exponential backoff: 1s, 2s, 4s...
      const delayMs = config.gemini.retryDelayMs * Math.pow(2, attempt - 1);
      logger.warn(
        `[${modelName}] Rate limited (attempt ${attempt}/${maxRetries}), retrying in ${delayMs}ms...`
      );
      
      await new Promise(resolve => setTimeout(resolve, delayMs));
      return generateWithRetry(model, prompt, modelName, attempt + 1);
    }

    throw error;
  }
}

function buildPrompt(input: DescriptionGeneratorInput): string {
  const configurationParts: string[] = [];

  if (input.configuration) {
    if (input.configuration.power) {
      configurationParts.push(`Power: ${input.configuration.power}`);
    }
    if (input.configuration.solar) {
      configurationParts.push(`Solar: ${input.configuration.solar}`);
    }
    if (input.configuration.battery) {
      configurationParts.push(`Battery: ${input.configuration.battery}`);
    }
    if (input.configuration.water) {
      configurationParts.push(`Water: ${input.configuration.water}`);
    }
  }

  const contractInfo =
    input.contractPeriod && input.contractPeriod.length > 0
      ? `Contract Period: ${input.contractPeriod[0]} to ${input.contractPeriod[input.contractPeriod.length - 1]}`
      : '';

  const prompt = `You are an expert energy facility description writer. Generate a professional product description for the following facility/plant:

Plant Name: ${input.plantName}
Plant Type: ${input.plantType || 'Not specified'}
${configurationParts.length > 0 ? configurationParts.join('\n') : 'Configuration: Not specified'}
${contractInfo}

Please provide a response in the following JSON format:
{
  "shortDescription": "A brief 1-2 sentence description (max 120 characters)",
  "longDescription": "A comprehensive 3-4 sentence description highlighting key features and benefits (max 500 characters)",
  "keyFeatures": ["feature1", "feature2", "feature3", "feature4"]
}

Generate specific, professional descriptions based on the plant type and configuration provided. Focus on operational capabilities and contract scope.`;

  return prompt;
}

interface ParsedResponse {
  shortDescription: string;
  longDescription: string;
  keyFeatures: string[];
}

function parseResponse(response: string): ParsedResponse {
  try {
    // Extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      shortDescription: parsed.shortDescription || '',
      longDescription: parsed.longDescription || '',
      keyFeatures: Array.isArray(parsed.keyFeatures) ? parsed.keyFeatures : [],
    };
  } catch (error) {
    logger.error(`Error parsing response: ${error}`);
    // Return default structure if parsing fails
    return {
      shortDescription: 'Energy facility',
      longDescription: response.substring(0, 500),
      keyFeatures: [],
    };
  }
}
