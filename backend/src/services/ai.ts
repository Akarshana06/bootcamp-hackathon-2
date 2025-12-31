import OpenAI from 'openai';
import { env } from '../config/env';

export class AIService {
  private openai: OpenAI;

  constructor() {
    if (!env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }
    
    this.openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
  }

  /**
   * Generate embeddings for the given text using OpenAI's API
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text,
      });

      if (!response.data[0]?.embedding) {
        throw new Error('No embedding returned from OpenAI');
      }

      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process clinical text with guardrails to prevent hallucinations
   */
  async processClinicalText(text: string, context: string): Promise<string> {
    try {
      const prompt = `As a clinical assistant, analyze the following text based on the provided context. 
      If the text contains any medical inaccuracies or potential issues, flag them. 
      Otherwise, provide a summary of the key points.
      
      Context: ${context}
      
      Text to analyze: ${text}`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a clinical assistant that helps analyze medical text for accuracy and completeness.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });

      return response.choices[0]?.message?.content || 'No response from AI';
    } catch (error) {
      console.error('Error processing clinical text:', error);
      throw new Error(`Failed to process clinical text: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const aiService = new AIService();
