import OpenAI from 'openai';
import { IdeaValidation } from '../models/idea';
import { logger } from '../utils/logger';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface IdeaData {
  title: string;
  description: string;
  category: string;
  targetAudience: string[];
}

interface ValidationRequest {
  idea: IdeaData;
  additionalContext?: string;
}

/**
 * Service for validating startup ideas using AI
 */
export class AIService {
  /**
   * Validate a startup idea using OpenAI's API
   */
  static async validateIdea(data: ValidationRequest): Promise<IdeaValidation> {
    try {
      logger.info(`Validating idea: ${data.idea.title}`);

      // Generate system prompt for the AI
      const systemPrompt = this.generateSystemPrompt();
      
      // Generate user prompt with idea details
      const userPrompt = this.generateUserPrompt(data);

      // Call OpenAI API
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.5,
        max_tokens: 1500,
        response_format: { type: 'json_object' }
      });

      // Parse response
      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('Failed to get response from AI');
      }

      // Parse JSON from the AI response
      const validation = JSON.parse(content) as IdeaValidation;
      
      // Ensure all required fields are present
      return this.formatValidationResult(validation);
    } catch (error) {
      logger.error('Error validating idea with AI:', error);
      throw new Error('Failed to validate idea: ' + (error as Error).message);
    }
  }

  /**
   * Generate a system prompt for the AI
   */
  private static generateSystemPrompt(): string {
    return `You are an expert startup advisor and market analyst. Your task is to evaluate startup ideas based on multiple factors and provide detailed, constructive feedback. 
    
Your analysis should be balanced, highlighting both strengths and weaknesses. Assign scores based on objective criteria, not personal preferences.

Format your response as a valid JSON object with the following structure:
{
  "marketViability": {
    "score": number (0-100),
    "feedback": "detailed explanation"
  },
  "technicalFeasibility": {
    "score": number (0-100),
    "feedback": "detailed explanation"
  },
  "competitiveLandscape": {
    "score": number (0-100),
    "feedback": "detailed explanation"
  },
  "userDemand": {
    "score": number (0-100),
    "feedback": "detailed explanation"
  },
  "overallScore": number (0-100),
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "strengthsAndWeaknesses": {
    "strengths": ["strength1", "strength2", "strength3"],
    "weaknesses": ["weakness1", "weakness2", "weakness3"]
  }
}

Ensure all numeric scores are integers between 0 and 100.`;
  }

  /**
   * Generate a user prompt with idea details
   */
  private static generateUserPrompt(data: ValidationRequest): string {
    const { idea, additionalContext } = data;
    
    let prompt = `Please evaluate this startup idea:

Title: ${idea.title}
Description: ${idea.description}
Category: ${idea.category}
Target Audience: ${idea.targetAudience.join(', ')}
`;

    if (additionalContext) {
      prompt += `\nAdditional Context: ${additionalContext}`;
    }

    return prompt;
  }

  /**
   * Format and validate the AI response
   */
  private static formatValidationResult(validation: any): IdeaValidation {
    // Ensure all fields are present with default values if missing
    const result: IdeaValidation = {
      marketViability: {
        score: validation.marketViability?.score || 0,
        feedback: validation.marketViability?.feedback || 'No feedback provided',
      },
      technicalFeasibility: {
        score: validation.technicalFeasibility?.score || 0,
        feedback: validation.technicalFeasibility?.feedback || 'No feedback provided',
      },
      competitiveLandscape: {
        score: validation.competitiveLandscape?.score || 0,
        feedback: validation.competitiveLandscape?.feedback || 'No feedback provided',
      },
      userDemand: {
        score: validation.userDemand?.score || 0,
        feedback: validation.userDemand?.feedback || 'No feedback provided',
      },
      overallScore: validation.overallScore || 0,
      recommendations: validation.recommendations || [],
      strengthsAndWeaknesses: {
        strengths: validation.strengthsAndWeaknesses?.strengths || [],
        weaknesses: validation.strengthsAndWeaknesses?.weaknesses || [],
      },
      validatedAt: new Date(),
    };

    return result;
  }
} 