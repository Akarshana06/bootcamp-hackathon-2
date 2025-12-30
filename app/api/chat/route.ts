import { NextResponse } from 'next/server';
import OpenAI from 'openai';import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { query, department } = await req.json();

    // 1. Generate Embedding for the user query
    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });
    const queryVector = embeddingRes.data[0].embedding;

    // 2. Vector Search in PostgreSQL (pgvector)
    // We search for the most relevant SOP chunks based on vector similarity
    const contextChunks: any[] = await prisma.$queryRaw`
      SELECT content, section 
      FROM "SopDocument" 
      ORDER BY embedding <=> CAST(${JSON.stringify(queryVector)} AS vector) 
      LIMIT 3;
    `;

    const contextText = contextChunks.map(c => `[Section: ${c.section}] ${c.content}`).join("\n");

    // 3. Grounded AI Completion
    const response = await openai.chat.completions.create({      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a Clinical SOP Assistant. 
          STRICT RULES:
          1. Use ONLY the provided SOP context to answer. 
          2. Context: ${contextText || "No context found."}
          3. If the answer is not in the context, respond EXACTLY: "This information is not in the official SOP. Please consult your supervisor."
          4. Do not use your own training data or outside medical knowledge.
          5. Provide answers in bullet points.
          6. Cite the Section Number at the end of the answer.`
        },
        { role: "user", content: query }
      ],
      temperature: 0, // Critical: 0 prevents hallucinations
    });

    const aiAnswer = response.choices[0].message.content;

    return NextResponse.json({
      answer: aiAnswer,
      sources: contextChunks.map(c => c.section),
      verified: !aiAnswer?.includes("consult your supervisor")
    });

  } catch (error: any) {
    console.error("AI_API_ERROR:", error);
    return NextResponse.json({ error: "Clinical System Timeout" }, { status: 500 });
  }
}