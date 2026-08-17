import { createSandbox, closeSandbox, getSandbox } from './sandbox';
import { analyzeScreenshot } from './llm';
import { executeAction, takeScreenshot } from './actions';
import { AgentState, DesktopAction } from './types';
import { config } from './config';

async function runAgent(userTask: string): Promise<void> {
  const state: AgentState = {
    iteration: 0,
    taskComplete: false,
    history: [],
  };

  try {
    // Create and setup sandbox
    const sandbox = await createSandbox();

    console.log(`\n🤖 Computer Use Agent Started`);
    console.log(`📋 Task: ${userTask}`);
    console.log(`⚙️  Max iterations: ${config.agent.maxIterations}\n`);

    // Main agent loop
    while (!state.taskComplete && state.iteration < config.agent.maxIterations) {
      state.iteration++;
      console.log(`\n─── Iteration ${state.iteration} ───`);

      // 1. Take screenshot
      console.log('📸 Capturing desktop...');
      const screenshotBase64 = await takeScreenshot(sandbox);

      // 2. Analyze with LLM
      console.log('🧠 Analyzing screenshot with LLM...');
      const llmResponse = await analyzeScreenshot(
        screenshotBase64,
        userTask,
        state.history.map((h) => h.action)
      );

      console.log(`💬 Reasoning: ${llmResponse.reasoning}`);
      console.log(`📊 Confidence: ${(llmResponse.confidence * 100).toFixed(1)}%`);

      // 3. Execute action
      await executeAction(sandbox, llmResponse.action);
      state.lastAction = llmResponse.action;

      // 4. Record history
      state.history.push({
        iteration: state.iteration,
        action: llmResponse.action,
        timestamp: new Date().toISOString(),
      });

      // 5. Check if task is complete
      if (llmResponse.action.type === 'complete') {
        state.taskComplete = true;
        console.log(`\n✅ Task completed at iteration ${state.iteration}`);
      }

      // Small delay between iterations
      if (!state.taskComplete) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    if (!state.taskComplete) {
      console.log(`\n⚠️  Task did not complete within ${config.agent.maxIterations} iterations`);
    }

    // Print summary
    console.log(`\n📋 Summary:`);
    console.log(`  Total iterations: ${state.iteration}`);
    console.log(`  Task complete: ${state.taskComplete}`);
    console.log(`  Final action: ${state.lastAction?.type || 'None'}`);

    if (config.agent.debugMode) {
      console.log(`\n📝 Full history:`);
      console.log(JSON.stringify(state.history, null, 2));
    }
  } catch (error) {
    console.error('❌ Agent error:', error);
    process.exit(1);
  } finally {
    await closeSandbox();
  }
}

// Example task - change this to run different tasks
const exampleTask = 'Open Firefox and navigate to https://example.com';

runAgent(exampleTask).then(() => {
  console.log('\n👋 Agent finished');
  process.exit(0);
});
