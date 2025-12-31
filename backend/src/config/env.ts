import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().default('3001'),
  DATABASE_URL: z.string().min(1, 'Database URL is required'),
  OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required'),
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  VECTOR_DIMENSION: z.string().default('1536'), // For OpenAI embeddings
});

export type EnvVars = z.infer<typeof envSchema>;

const envVars = envSchema.safeParse(process.env);

if (!envVars.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(envVars.error.format(), null, 2));
  process.exit(1);
}

export const env = envVars.data;
