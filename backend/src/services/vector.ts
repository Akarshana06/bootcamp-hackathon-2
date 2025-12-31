import { PrismaClient, type VectorEmbedding } from '@prisma/client';
import { aiService } from './ai';

export class VectorService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a new vector embedding for the given text and associate it with an SOP
   */
  async createEmbedding(sopId: string, text: string): Promise<VectorEmbedding> {
    try {
      // Generate the embedding using OpenAI
      const embedding = await aiService.generateEmbedding(text);

      // Store the embedding in the database
      return await this.prisma.vectorEmbedding.create({
        data: {
          content: text,
          embedding: embedding as unknown as any, // Type assertion for pgvector
          sopId,
        },
      });
    } catch (error) {
      console.error('Error creating vector embedding:', error);
      throw new Error(`Failed to create embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Find similar SOPs based on the input text using vector similarity search
   */
  async findSimilarSOPs(text: string, limit: number = 5): Promise<Array<{
    id: string;
    title: string;
    content: string;
    similarity: number;
  }>> {
    try {
      // Generate the embedding for the search query
      const embedding = await aiService.generateEmbedding(text);

      // Use Prisma's raw query to perform the vector similarity search
      const results = await this.prisma.$queryRaw<Array<{
        id: string;
        title: string;
        content: string;
        similarity: number;
      }>>`
        SELECT 
          s.id,
          s.title,
          s.content,
          1 - (v.embedding <=> ${JSON.stringify(embedding)}::vector) as similarity
        FROM "SOP" s
        JOIN "VectorEmbedding" v ON s.id = v."sopId"
        WHERE s."isActive" = true
        ORDER BY v.embedding <=> ${JSON.stringify(embedding)}::vector
        LIMIT ${limit};
      `;

      return results;
    } catch (error) {
      console.error('Error finding similar SOPs:', error);
      throw new Error(`Failed to find similar SOPs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update an existing vector embedding
   */
  async updateEmbedding(embeddingId: string, text: string): Promise<VectorEmbedding> {
    try {
      // Generate a new embedding for the updated text
      const embedding = await aiService.generateEmbedding(text);

      // Update the embedding in the database
      return await this.prisma.vectorEmbedding.update({
        where: { id: embeddingId },
        data: {
          content: text,
          embedding: embedding as unknown as any, // Type assertion for pgvector
        },
      });
    } catch (error) {
      console.error('Error updating vector embedding:', error);
      throw new Error(`Failed to update embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a vector embedding
   */
  async deleteEmbedding(embeddingId: string): Promise<void> {
    try {
      await this.prisma.vectorEmbedding.delete({
        where: { id: embeddingId },
      });
    } catch (error) {
      console.error('Error deleting vector embedding:', error);
      throw new Error(`Failed to delete embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const createVectorService = (prisma: PrismaClient) => new VectorService(prisma);
