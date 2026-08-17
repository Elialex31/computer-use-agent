import dotenv from 'dotenv';

dotenv.config();

export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.AGENT_MODEL || 'gpt-4o',
  },
  e2b: {
    apiKey: process.env.E2B_API_KEY || '',
  },
  sandbox: {
    resolution: [
      parseInt(process.env.SANDBOX_RESOLUTION_WIDTH || '1024'),
      parseInt(process.env.SANDBOX_RESOLUTION_HEIGHT || '720'),
    ] as [number, number],
    dpi: parseInt(process.env.SANDBOX_DPI || '96'),
    timeoutMs: parseInt(process.env.AGENT_TIMEOUT_MS || '300000'),
  },
  agent: {
    maxIterations: parseInt(process.env.MAX_ITERATIONS || '50'),
    debugMode: process.env.DEBUG_MODE === 'true',
  },
};

// Validation
if (!config.openai.apiKey) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}

if (!config.e2b.apiKey) {
  throw new Error('E2B_API_KEY environment variable is required');
}
