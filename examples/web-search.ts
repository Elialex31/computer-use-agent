/**
 * Example: Web Search Task
 * 
 * This agent performs a web search using Firefox and reads the results.
 * 
 * Task: "Open Firefox, navigate to Google, search for 'AI agents 2024', and take a screenshot of the results"
 */

import { createSandbox, closeSandbox } from '../src/sandbox';
import { analyzeScreenshot } from '../src/llm';
import { executeAction, takeScreenshot } from '../src/actions';
import { config } from '../src/config';

const SEARCH_TASK = 'Open Firefox, navigate to https://google.com, search for "AI agents 2024", and wait for results to load';

async function runWebSearchExample(): Promise<void> {
  let iteration = 0;
  const maxIterations = 20;

  try {
    const sandbox = await createSandbox();
    console.log('\n🔍 Web Search Example');
    console.log(`📋 Task: ${SEARCH_TASK}\n`);

    while (iteration < maxIterations) {
      iteration++;
      console.log(`\n--- Iteration ${iteration} ---`);

      const screenshotBase64 = await takeScreenshot(sandbox);
      const llmResponse = await analyzeScreenshot(screenshotBase64, SEARCH_TASK);

      console.log(`💬 ${llmResponse.reasoning}`);
      await executeAction(sandbox, llmResponse.action);

      if (llmResponse.action.type === 'complete') {
        console.log('\n✅ Task completed!');
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await closeSandbox();
  }
}

// Uncomment to run
// runWebSearchExample();
