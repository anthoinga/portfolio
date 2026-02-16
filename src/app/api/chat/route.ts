import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt } from './systemPrompt';
import { Project } from '@/app/types';

// Force dynamic rendering (required for rate limiting with request headers)
export const dynamic = 'force-dynamic';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Rate limiting: in-memory map (simple, no Redis needed)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function rateLimit(ip: string, maxRequests = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// Clean up old rate limit records every 5 minutes
setInterval(() => {
  const now = Date.now();
  Array.from(rateLimitMap.entries()).forEach(([ip, record]) => {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  });
}, 5 * 60 * 1000);

function isComplexQuery(query: string): boolean {
  const triggers = [
    'process',
    'approach',
    'why',
    'how do you',
    'tell me about',
    'explain',
    'what made you',
    'philosophy',
    'thinking',
    'methodology',
  ];
  const lowerQuery = query.toLowerCase();
  return triggers.some(t => lowerQuery.includes(t));
}

function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    throw new Error('Invalid input type');
  }

  // Limit length (prevent DoS)
  if (input.length > 500) {
    input = input.slice(0, 500);
  }

  // Remove HTML tags (defense in depth)
  return input.replace(/[<>]/g, '').trim();
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a minute.' },
        { status: 429 }
      );
    }

    // Parse and validate input
    const body = await request.json();
    const { query, language = 'en', matchedProjects = [], allProjectsCount = 0 } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const sanitizedQuery = sanitizeInput(query);

    // Select model based on query complexity
    const model = isComplexQuery(sanitizedQuery)
      ? 'claude-3-5-sonnet-20241022' // Complex queries
      : 'claude-3-5-haiku-20241022';  // Simple queries (12x cheaper)

    // Build system prompt with project context
    const systemPrompt = buildSystemPrompt(
      language as 'en' | 'es',
      matchedProjects as Project[]
    );

    // Call Anthropic API
    const message = await anthropic.messages.create({
      model,
      max_tokens: 500,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: sanitizedQuery,
        },
      ],
    });

    // Extract response
    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : 'Sorry, I could not generate a response.';

    return NextResponse.json({
      response: responseText,
      model: model.includes('haiku') ? 'haiku' : 'sonnet',
      tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
    });

  } catch (error: any) {
    console.error('AI API error:', error);

    // Sanitize error message (don't leak API details)
    const errorMessage = error?.message?.includes('API key')
      ? 'AI service temporarily unavailable'
      : 'Unable to process request';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
